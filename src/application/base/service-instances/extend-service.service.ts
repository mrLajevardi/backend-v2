import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { InvalidAradAIConfigException } from 'src/infrastructure/exceptions/invalid-arad-ai-config.exception';
import { ItemTypesService } from '../item-types/item-types.service';
import { PlansService } from '../plans/plans.service';
import { ConfigsService } from '../configs/configs.service';
import { ServiceItemsService } from '../service-items/service-items.service';
import { ServiceInstancesService } from './service-instances.service';
import { ServiceTypesService } from '../service-types/service-types.service';
import { ServicePropertiesService } from '../service-properties/service-properties.service';
import { SessionsService } from '../sessions/sessions.service';
import { InvalidServiceIdException } from 'src/infrastructure/exceptions/invalid-service-id.exception';
import aradAIConfig from 'src/infrastructure/config/aradAIConfig';
import jwt from 'jsonwebtoken';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';

@Injectable()
export class ExtendServiceService {
  constructor(
    private readonly itemTypesService: ItemTypesService,
    private readonly plansService: PlansService,
    private readonly configsService: ConfigsService,
    private readonly serviceItemsService: ServiceItemsService,
    private readonly serviceInstancesService: ServiceInstancesService,
    private readonly serviceTypeService: ServiceTypesService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly sessionService: SessionsService,
  ) {}

  async getAiServiceInfo(
    userId,
    serviceId,
    qualityPlanCode,
    duration,
    expireDate,
    createdDate,
  ) {
    const aradAiItem = await this.itemTypesService.findOne({
      where: {
        and: [{ Code: 'ARADAIItem' }],
      },
    });
    const plans = await this.plansService.findOne({
      where: {
        and: [{ ServiceTypeID: 'aradAi' }, { Code: { like: qualityPlanCode } }],
      },
    });

    const AiServiceConfigs = await this.configsService.find({
      where: {
        and: [
          { PropertyKey: { like: '%' + qualityPlanCode + '%' } },
          { ServiceTypeID: serviceId },
        ],
      },
    });
    const ServiceAiInfo = {
      qualityPlanCode,
      createdDate,
      userId,
      duration,
      expireDate,
    };
    if (isEmpty(AiServiceConfigs)) {
      throw new InvalidAradAIConfigException();
    }

    AiServiceConfigs.forEach((element) => {
      const key = element.propertyKey.split('.').slice(-1)[0];
      const item = element.value;
      ServiceAiInfo[key] = item;
    });

    ServiceAiInfo['costPerRequest'] =
      aradAiItem.fee + aradAiItem.fee * plans.additionRatio;
    ServiceAiInfo['costPerMonth'] = plans.additionAmount;
    return ServiceAiInfo;
  }

  // create service items
  async createServiceItems(serviceInstanceID, items, data) {
    for (const item of Object.keys(items)) {
      const itemTitle = items[item].Code;
      // TODO just items of current user should be added
      const itemQuantity = data[itemTitle] || 0;
      const itemTypeId = items[item].ID;
      await this.serviceItemsService.create({
        serviceInstanceId: serviceInstanceID,
        itemTypeId: itemTypeId,
        quantity: itemQuantity,
        itemTypeCode: items[item].Code,
      });
    }
  }

  //create service instance
  async createServiceInstance(userId, serviceTypeID, expireDate, name = null) {
    const lastServiceInstanceId = await this.serviceInstancesService.findOne({
      where: {
        UserID: userId,
      },
      order: { Index: -1 },
    });
    const index = lastServiceInstanceId
      ? lastServiceInstanceId[0].Index + 1
      : 0;
    const serviceType = await this.serviceTypeService.findById(serviceTypeID);
    const serivce = await this.serviceInstancesService.create({
      userId: userId,
      serviceType: serviceType,
      status: 1,
      createDate: new Date(),
      lastUpdateDate: new Date(),
      expireDate: expireDate,
      index: index,
      name: name,
    });
    return Promise.resolve(serivce.id);
  }

  //enable Vdc On Vcloud
  async enableVdcOnVcloud(serviceInstanceID, userId) {
    const vdc = await this.servicePropertiesService.findOne({
      where: {
        and: [
          { ServiceInstanceID: serviceInstanceID },
          { PropertyKey: 'vdcId' },
        ],
      },
    });

    const sessionToken = await this.sessionService.checkAdminSession(userId);

    // PLEASE TAKE CARE , THIS PART IS DISABLED BECAUSE OF MOVEMENT PROCESS
    throw new InternalServerErrorException('METHOD SHOULD BE IMPLEMENTED');
    // await mainWrapper.admin.vdc.enableVdc(vdc.value, sessionToken);
  }

  //update service instance
  async updateServiceInstanceExpireDate(userId, serviceInstanceId, expireDate) {
    const serivce = await this.serviceInstancesService.updateAll(
      {
        userId: userId,
        id: serviceInstanceId,
      },
      {
        lastUpdateDate: new Date(),
        expireDate: expireDate,
        warningSent: 0,
        isDisabled: 0,
      },
    );

    return Promise.resolve(serivce);
  }

  QualityPlans;
  async createServiceInstanceAndToken(
    app,
    options,
    expireDate,
    serviceId,
    transaction,
    name,
  ) {
    let token = null;
    const userId = options.accessToken.userId;

    const serviceType = await app.models.ServiceTypes.findOne({
      where: { ID: serviceId },
    });
    //check validity of serviceId
    if (isEmpty(serviceType)) {
      throw new InvalidServiceIdException();
    }

    const serviceInstanceId = await this.createServiceInstance(
      userId,
      serviceId,
      expireDate,
      name,
    );
    const itemTypes = await this.itemTypesService.find({
      where: { ServiceTypeID: serviceId },
    });

    const invoiceItemList = await app.models.InvoiceItemList.find({
      where: {
        and: [{ InvoiceID: transaction.InvoiceID }, { UserID: userId }],
      },
    });
    const itemTypeData = {};
    invoiceItemList.forEach((element) => {
      itemTypeData[element.Code] = element.Quantity;
    });

    await this.createServiceItems(serviceInstanceId, itemTypes, itemTypeData);
    if (serviceId == 'aradAi') {
      // find user invoice
      const invoice = await app.models.Invoices.findOne({
        where: {
          and: [{ UserID: userId }, { ID: transaction.InvoiceID }],
        },
      });
      const invoicePlan = await app.models.InvoicePlans.findOne({
        where: {
          and: [
            { PlanCode: { like: '%ai%' } },
            { InvoiceID: transaction.InvoiceID },
          ],
        },
      });

      const duration = Math.round(
        (invoice.EndDateTime - invoice.DateTime) / 86400000,
      );

      const ServiceAiInfo = await this.getAiServiceInfo(
        userId,
        'aradAi',
        invoicePlan.PlanCode,
        duration,
        invoice.EndDateTime,
        invoice.DateTime,
      );
      token = jwt.sign(ServiceAiInfo, aradAIConfig.JWT_SECRET_KEY);

      await app.models.ServiceProperties.create({
        ServiceInstanceID: serviceInstanceId,
        PropertyKey: serviceId + '.token',
        Value: token,
      });
      return Promise.resolve({ token, serviceInstanceId });
    }
    return Promise.resolve({
      scriptPath: serviceType.CreateInstanceScript,
      serviceInstanceId,
    });
  }
  async extendServiceInstanceAndToken(app, options, invoice) {
    const token = null;
    const userId = options.accessToken.userId;
    const serviceInstanceId = invoice.ServiceInstanceID;
    const serviceInstancesModel = app.models.ServiceInstances;

    const oldSerivce = await serviceInstancesModel.findOne({
      where: {
        and: [
          { UserID: userId },
          { ServiceInstanceID: serviceInstanceId },
          { IsDeleted: false },
        ],
      },
    });
    if (!oldSerivce) {
      throw new ForbiddenException();
    }

    await this.updateServiceInstanceExpireDate(
      userId,
      serviceInstanceId,
      invoice.EndDateTime,
    );
    // }
    if (invoice.ServiceTypeID == 'vdc') {
      await this.enableVdcOnVcloud(serviceInstanceId, userId);
    }

    return Promise.resolve({
      serviceInstanceId,
    });
  }
}
