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
import { Invoices } from 'src/infrastructure/database/entities/Invoices';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import { Transactions } from 'src/infrastructure/database/entities/Transactions';
import { InvoiceItemListService } from '../../crud/invoice-item-list/invoice-item-list.service';
import { InvoicePlansTableService } from '../../crud/invoice-plans-table/invoice-plans-table.service';

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
    private readonly invoiceItemListService: InvoiceItemListService,
    private readonly invoicePlanTableService: InvoicePlansTableService,
    private readonly serviceSum: ServiceItemsSumService,
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
      const itemTitle = items[item].code;
      // TODO just items of current user should be added
      const itemQuantity = data[itemTitle] || 0;
      const itemTypeId = items[item].id;
      await this.serviceItemsTable.create({
        serviceInstanceId: serviceInstanceID,
        itemTypeId: itemTypeId,
        quantity: itemQuantity,
        itemTypeCode: items[item].code,
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
  async enableVdcOnVcloud(serviceInstanceId, userId) {
    const vdc = await this.servicePropertiesTable.findOne({
      where: {
        serviceInstanceId,
        propertykey: 'vdcId',
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
    options,
    expireDate,
    serviceId,
    transaction: Transactions,
    name,
  ) {
    const token = null;
    const userId = options.user.userId;

    const serviceType = await this.serviceTypeTable.findOne({
      where: { id: serviceId },
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
      where: { serviceTypeId: serviceId },
    });
    const invoiceItemList = await this.invoiceItemListService.find({
      where: {
        invoiceId: transaction.invoiceId,
        userId,
      },
    });
    const itemTypeData = {};
    invoiceItemList.forEach((element) => {
      itemTypeData[element.code] = element.quantity;
    });

    await this.createServiceItems(serviceInstanceId, itemTypes, itemTypeData);
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
          planCode: { like: '%ai%' },
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
      const token = jwt.sign(ServiceAiInfo, aradAIConfig.JWT_SECRET_KEY);

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
  async extendServiceInstanceAndToken(options, invoice: Invoices) {
    const token = null;
    const userId = options.accessToken.userId;
    const serviceInstanceId = invoice.serviceInstance.id;

    const oldSerivce = await this.serviceInstancesTable.findOne({
      where: {
        userId,
        serviceInstanceId,
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
      await this.enableVdcOnVcloud(serviceInstanceId, userId);
    }

    return Promise.resolve({
      serviceInstanceId,
    });
  }
  async approveTransactionAndInvoice(
    invoice: Invoices,
    transaction: Transactions,
  ) {
    const { serviceInstanceId, userId: userId, id: invoiceId } = invoice;
    // approve user transaction
    await this.transactionTableService.updateAll(
      {
        userId: userId,
        invoiceId: invoiceId,
      },
      {
        isApproved: true,
        serviceInstanceId,
      },
    );
    // update user invoice
    this.invoicesTableService.updateAll(
      {
        userId: userId,
        id: transaction.invoiceId,
      },
      {
        payed: true,
      },
    );
  }
}
