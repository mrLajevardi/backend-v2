import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { InvalidAradAIConfigException } from 'src/infrastructure/exceptions/invalid-arad-ai-config.exception';

import { SessionsService } from 'src/application/base/sessions/sessions.service';
import { InvalidServiceIdException } from 'src/infrastructure/exceptions/invalid-service-id.exception';
import jwt from 'jsonwebtoken';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { DiscountsTableService } from '../../crud/discounts-table/discounts-table.service';
import { InvoiceDiscountsTableService } from '../../crud/invoice-discounts-table/invoice-discounts-table.service';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { ServiceItemsSumService } from '../../crud/service-items-sum/service-items-sum.service';
import { ServicePropertiesTableService } from '../../crud/service-properties-table/service-properties-table.service';
import { ServiceTypesTableService } from '../../crud/service-types-table/service-types-table.service';
import { InvoicesService } from '../../invoice/service/invoices.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { UserService } from '../../user/user.service';
import { DiscountsService } from './discounts.service';
import { ServiceChecksService } from './service-checks/service-checks.service';
import { ServiceService } from './service.service';
import { PlansTableService } from '../../crud/plans-table/plans-table.service';
import { ConfigsTableService } from '../../crud/configs-table/configs-table.service';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';

@Injectable()
export class ExtendServiceService {
  constructor(
    private readonly serviceInstancesTable: ServiceInstancesTableService,
    private readonly itemTypesTable: ItemTypesTableService,
    private readonly serviceTypeTable: ServiceTypesTableService,
    private readonly servicePropertiesTable: ServicePropertiesTableService,
    private readonly plansTable: PlansTableService,
    private readonly configsTable: ConfigsTableService,
    private readonly serviceItemsTable: ServiceItemsTableService,
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
    const aradAiItem = await this.itemTypesTable.findOne({
      where: {
        and: [{ Code: 'ARADAIItem' }],
      },
    });
    const plans = await this.plansTable.findOne({
      where: {
        and: [{ ServiceTypeID: 'aradAi' }, { Code: { like: qualityPlanCode } }],
      },
    });

    const AiServiceConfigs = await this.configsTable.find({
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
      await this.serviceItemsTable.create({
        serviceInstanceId: serviceInstanceID,
        itemTypeId: itemTypeId,
        quantity: itemQuantity,
        itemTypeCode: items[item].Code,
      });
    }
  }

  //create service instance
  async createServiceInstance(userId, serviceTypeID, expireDate, name = null) {
    const lastServiceInstanceId = await this.serviceInstancesTable.findOne({
      where: {
        userId,
      },
      order: { index: -1 },
    });
    const index = lastServiceInstanceId ? lastServiceInstanceId.index + 1 : 0;
    const serviceType = await this.serviceTypeTable.findById(serviceTypeID);
    const serivce = await this.serviceInstancesTable.create({
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
    const vdc = await this.servicePropertiesTable.findOne({
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
    const serivce = await this.serviceInstancesTable.updateAll(
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
    const itemTypes = await this.itemTypesTable.find({
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
      token = jwt.sign(ServiceAiInfo, process.env.ARAD_AI_JWT_SECRET_KEY);

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
