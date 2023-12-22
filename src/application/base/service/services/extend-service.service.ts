import { Inject, Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { InvalidAradAIConfigException } from 'src/infrastructure/exceptions/invalid-arad-ai-config.exception';

import { SessionsService } from 'src/application/base/sessions/sessions.service';
import { InvalidServiceIdException } from 'src/infrastructure/exceptions/invalid-service-id.exception';
import * as jwt from 'jsonwebtoken';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { ServicePropertiesTableService } from '../../crud/service-properties-table/service-properties-table.service';
import { ServiceTypesTableService } from '../../crud/service-types-table/service-types-table.service';
import { PlansTableService } from '../../crud/plans-table/plans-table.service';
import { ConfigsTableService } from '../../crud/configs-table/configs-table.service';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import { Invoices } from 'src/infrastructure/database/entities/Invoices';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import { Transactions } from 'src/infrastructure/database/entities/Transactions';
import { InvoiceItemListService } from '../../crud/invoice-item-list/invoice-item-list.service';
import { InvoicePlansTableService } from '../../crud/invoice-plans-table/invoice-plans-table.service';
import { In, Like, UpdateResult } from 'typeorm';
import { ServiceAiInfoDto } from '../dto/return/service-ai-info.dto';
import { ItemTypes } from 'src/infrastructure/database/entities/ItemTypes';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { ServicePlanTypeEnum } from '../enum/service-plan-type.enum';
import { InvoiceItems } from 'src/infrastructure/database/entities/InvoiceItems';
import { InvoiceItemsTableService } from '../../crud/invoice-items-table/invoice-items-table.service';
import { ItemTypeCodes } from '../../itemType/enum/item-type-codes.enum';
import { ServiceItemTypesTreeService } from '../../crud/service-item-types-tree/service-item-types-tree.service';
import { DataCenterTableService } from '../../crud/datacenter-table/data-center-table.service';
import {
  BASE_DATACENTER_SERVICE,
  BaseDatacenterService,
} from '../../datacenter/interface/datacenter.interface';
import { VdcServiceProperties } from 'src/application/vdc/enum/vdc-service-properties.enum';
import { VmPowerStateEventEnum } from 'src/wrappers/main-wrapper/service/user/vm/enum/vm-power-state-event.enum';
import { ServiceItems } from '../../../../infrastructure/database/entities/ServiceItems';
import { CreateServiceDiscount } from '../interface/create-service-discount.interface';
import { ServiceDiscountTableService } from '../../crud/service-discount-table/service-discount-table-service.service';

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
    private readonly transactionTableService: TransactionsTableService,
    private readonly invoicesTableService: InvoicesTableService,
    private readonly invoicePlanTableService: InvoicePlansTableService,
    private readonly invoiceItemsTableService: InvoiceItemsTableService,
    private readonly serviceItemTypeTree: ServiceItemTypesTreeService,
    @Inject(BASE_DATACENTER_SERVICE)
    private readonly datacenterService: BaseDatacenterService,
    private readonly serviceDiscountTableService: ServiceDiscountTableService,
    private readonly serviceItemTableTypeTree: ServiceItemTypesTreeService,
  ) {}

  async getAiServiceInfo(
    userId: number,
    serviceId: string,
    qualityPlanCode: string,
    duration: number,
    expireDate: Date,
    createdDate: Date,
  ): Promise<ServiceAiInfoDto> {
    const aradAiItem = await this.itemTypesTable.findOne({
      where: {
        code: 'ARADAIItem',
      },
    });

    const plans = await this.plansTable.findOne({
      where: {
        code: Like('%' + qualityPlanCode + '%'),
      },
    });
    console.log(plans);

    //qualityPlanCode='normal';
    console.log(qualityPlanCode, serviceId);
    const AiServiceConfigs = await this.configsTable.find({
      where: {
        propertyKey: Like('%' + qualityPlanCode + '%'),
        serviceTypeId: 'AradAi',
      },
    });

    console.log(AiServiceConfigs);
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

  async createServiceDiscount(dto: CreateServiceDiscount): Promise<void> {
    await this.serviceDiscountTableService.create({
      ...dto,
      activateDate: new Date(),
      enabled: true,
    });
  }
  async addGenIdToServiceProperties(
    invoiceItems: InvoiceItems[],
    serviceInstanceId: string,
  ): Promise<void> {
    for (const invoiceItem of invoiceItems) {
      const genIdKey = 'genId';
      const generationItem = await this.serviceItemTypeTree.findOne({
        where: {
          codeHierarchy: Like(`${ItemTypeCodes.Generation}%`),
          id: invoiceItem.itemId,
        },
      });
      const generationChild = await this.serviceItemTypeTree.findOne({
        where: {
          id: Number(generationItem.hierarchy.split('_')[1]),
        },
      });
      const datacenterList =
        await this.datacenterService.getDatacenterConfigWithGen();
      const targetDc = datacenterList.find((dc) => {
        return dc.datacenter === generationChild.datacenterName.toLowerCase();
      });
      const gen = targetDc.gens.find((gen) => {
        return gen.name === generationChild.code;
      });
      await this.servicePropertiesTable.create({
        serviceInstanceId,
        propertyKey: genIdKey,
        value: gen.id,
      });
      break;
    }
  }
  // create service items
  async createServiceItems(
    invoiceItems: InvoiceItems[],
    serviceInstanceId: string,
  ): Promise<void> {
    for (const invoiceItem of invoiceItems) {
      await this.serviceItemsTable.create({
        serviceInstanceId,
        itemTypeId: invoiceItem.id,
        quantity: 0,
        value: invoiceItem.value,
        itemTypeCode: '',
      });
    }
  }

  //create service instance
  async createServiceInstance(
    userId: number,
    serviceTypeID: string,
    expireDate: Date | null,
    name = null,
    datacenterName: string,
    servicePlanType: number | null = null,
    lastState: VmPowerStateEventEnum = null,
    offset: Date = null,
  ): Promise<string> {
    const lastServiceInstanceId = await this.serviceInstancesTable.findOne({
      where: {
        userId,
      },
      order: { index: -1 },
    });
    const index = lastServiceInstanceId ? lastServiceInstanceId.index + 1 : 0;
    const serviceType = await this.serviceTypeTable.findById(serviceTypeID);
    const service = await this.serviceInstancesTable.create({
      userId: userId,
      serviceType: serviceType,
      status: 1,
      createDate: new Date(),
      lastUpdateDate: new Date(),
      expireDate: expireDate,
      index: index,
      name: name,
      servicePlanType,
      datacenterName,
      offset,
      lastState,
    });
    return Promise.resolve(service.id);
  }

  //enable Vdc On Vcloud
  async enableVdcOnVcloud(
    serviceInstanceId: string,
    //userId: number,
  ): Promise<void> {
    const vdc = await this.servicePropertiesTable.findOne({
      where: {
        serviceInstanceId,
        propertyKey: 'vdcId',
      },
    });

    const sessionToken = await this.sessionService.checkAdminSession();
    await mainWrapper.admin.vdc.enableVdc(vdc.value, sessionToken);
  }

  //update service instance
  async updateServiceInstanceExpireDate(
    userId: number,
    serviceInstanceId: string,
    expireDate: Date,
  ): Promise<UpdateResult> {
    const serivce = await this.serviceInstancesTable.updateAll(
      {
        userId: userId,
        id: serviceInstanceId,
      },
      {
        lastUpdateDate: new Date(),
        expireDate: expireDate,
        warningSent: 0,
        isDisabled: false,
      },
    );

    return Promise.resolve(serivce);
  }

  async createServiceInstanceAndToken(
    options: SessionRequest,
    expireDate: Date,
    serviceId: string,
    transaction: Transactions,
    name: string,
    datacenterName: string | null = null,
    servicePlanType: number,
  ): Promise<
    | { token: string; serviceInstanceId: string }
    | { scriptPath: string; serviceInstanceId: string }
  > {
    //const token = null;
    const userId = options.user.userId;

    const serviceType = await this.serviceTypeTable.findOne({
      where: { id: serviceId, datacenterName },
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
      datacenterName,
      servicePlanType,
    );
    const invoiceItems = await this.invoiceItemsTableService.find({
      where: {
        invoice: { id: transaction.invoiceId },
      },
    });
    await this.createServiceItems(invoiceItems, serviceInstanceId);
    await this.addGenIdToServiceProperties(invoiceItems, serviceInstanceId);
    console.log('working');
    if (serviceId == 'aradAi') {
      // find user invoice
      const invoice = await this.invoicesTableService.findOne({
        where: {
          id: transaction.invoiceId,
          userId,
        },
      });
      console.log(invoice);
      const invoicePlan = await this.invoicePlanTableService.findOne({
        where: {
          planCode: Like('%ai%'),
          invoiceId: transaction.invoiceId,
        },
      });

      const calculatedDuration =
        (new Date(invoice.endDateTime).getTime() -
          new Date(invoice.dateTime).getTime()) /
        86400000;
      const duration = Math.round(calculatedDuration);

      const ServiceAiInfo = await this.getAiServiceInfo(
        userId,
        'aradAi',
        invoicePlan.planCode,
        duration,
        invoice.endDateTime,
        invoice.dateTime,
      );
      const token = jwt.sign(ServiceAiInfo, process.env.ARAD_AI_JWT_SECRET_KEY);

      await this.servicePropertiesTable.create({
        serviceInstanceId: serviceInstanceId,
        propertyKey: serviceId + '.token',
        value: token,
      });
      return Promise.resolve({ token, serviceInstanceId });
    }
    return Promise.resolve({
      scriptPath: serviceType.createInstanceScript,
      serviceInstanceId,
    });
  }

  async extendServiceInstanceAndToken(
    options: SessionRequest,
    invoice: Invoices,
  ): Promise<{ serviceInstanceId: string }> {
    //const token = null;
    const userId = options.user.userId;
    const serviceInstanceId = invoice.serviceInstanceId;

    const oldSerivce = await this.serviceInstancesTable.findOne({
      where: {
        userId,
        id: serviceInstanceId,
        isDeleted: false,
      },
    });
    if (!oldSerivce) {
      throw new ForbiddenException();
    }

    await this.updateServiceInstanceExpireDate(
      userId,
      serviceInstanceId,
      invoice.endDateTime,
    );
    // }
    if (invoice.serviceTypeId == 'vdc') {
      await this.enableVdcOnVcloud(serviceInstanceId);
    }

    return Promise.resolve({
      serviceInstanceId,
    });
  }

  async approveTransactionAndInvoice(
    invoice: Invoices,
    transaction: Transactions,
  ): Promise<void> {
    const { serviceInstanceId, userId: userId, id: invoiceId } = invoice;
    // approve user transaction
    // await this.transactionTableService.updateAll(
    //   {
    //     userId: userId,
    //     invoiceId: invoiceId,
    //   },
    //   {
    //     isApproved: true,
    //     serviceInstanceId,
    //   },
    // );

    await this.transactionTableService.update(transaction.id, {
      isApproved: true,
      serviceInstanceId: serviceInstanceId,
    });

    // update user invoice
    await this.invoicesTableService.updateAll(
      {
        userId: userId,
        id: transaction.invoiceId,
      },
      {
        payed: true,
      },
    );
  }

  async upgradeService(
    serviceInstanceId: string,
    invoiceId: number,
  ): Promise<void> {
    const invoiceItems: InvoiceItems[] =
      await this.invoiceItemsTableService.find({
        where: {
          invoiceId,
        },
      });
    const serviceItems: ServiceItems[] = await this.serviceItemsTable.find({
      where: {
        serviceInstanceId: serviceInstanceId,
      },
    });

    for (const invoiceItem of invoiceItems) {
      const foundItem = serviceItems.find(
        (serviceItem) => serviceItem.itemTypeId === invoiceItem.itemId,
      );

      if (foundItem) {
        await this.serviceItemsTable.update(foundItem.id, {
          value: invoiceItem.value,
        });
      } else {
        await this.serviceItemsTable.create({
          serviceInstanceId: serviceInstanceId,
          itemTypeId: invoiceItem.itemId,
          value: invoiceItem.value,
          itemTypeCode: null,
          quantity: null,
        });
      }
    }
  }
}
