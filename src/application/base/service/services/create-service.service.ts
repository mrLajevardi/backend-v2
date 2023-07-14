import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { addMonths } from 'src/infrastructure/helpers/date-time.helper';
import { ServiceChecksService } from './service-checks/service-checks.service';
import { InvalidServiceParamsException } from 'src/infrastructure/exceptions/invalid-service-params.exception';
import { InvalidServiceIdException } from 'src/infrastructure/exceptions/invalid-service-id.exception';
import { MaxAvailableServiceException } from 'src/infrastructure/exceptions/max-available-service.exception';
import { InvalidDiscountIdException } from 'src/infrastructure/exceptions/invalid-discount-id.exception';
import { InvalidQualityPlanException } from 'src/infrastructure/exceptions/invalid-quality-plan.exception';
import Costs from '../classes/costs';
import aradAIConfig from 'src/infrastructure/config/aradAIConfig';

import { AiService } from 'src/application/ai/ai.service';
import { ServiceItemsSumService } from 'src/application/base/crud/service-items-sum/service-items-sum.service';
import { UserService } from 'src/application/base/user/user.service';
import { NotEnoughCreditException } from 'src/infrastructure/exceptions/not-enough-credit.exception';
import { InvoicesService } from 'src/application/base/invoice/service/invoices.service';
import { TransactionsService } from 'src/application/base/transactions/transactions.service';
import { importScript } from 'src/infrastructure/helpers/import-script.helper';
import { CreateServiceInstancesDto } from '../../crud/service-instances-table/dto/create-service-instances.dto';
import { DiscountsTableService } from '../../crud/discounts-table/discounts-table.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { ItemTypesTableService } from '../../crud/item-types-table/item-types-table.service';
import { ServicePropertiesTableService } from '../../crud/service-properties-table/service-properties-table.service';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import { InvoiceItemsTableService } from '../../crud/invoice-items-table/invoice-items-table.service';
import { InvoiceDiscountsTableService } from '../../crud/invoice-discounts-table/invoice-discounts-table.service';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { ServiceTypesTableService } from '../../crud/service-types-table/service-types-table.service';
import { InvoicesTableService } from '../../crud/invoices-table/invoices-table.service';
import { UserTableService } from '../../crud/user-table/user-table.service';
import { QualityPlansService } from '../../crud/quality-plans/quality-plans.service';
import { DiscountsService } from './discounts.service';
import { ServiceService } from './service.service';

@Injectable()
export class CreateServiceService {
  constructor(
    private readonly discountsTable: DiscountsTableService,
    private readonly discountsService: DiscountsService,
    private readonly userService: UserService,
    private readonly invoiceService: InvoicesService,
    private readonly serviceInstancesTable: ServiceInstancesTableService,
    private readonly serviceChecksService: ServiceChecksService,
    private readonly qualityPlansService: QualityPlansService,
    private readonly itemTypesTable: ItemTypesTableService,
    private readonly serviceItemsSumService: ServiceItemsSumService,
    private readonly serviceTypeTable: ServiceTypesTableService,
    private readonly servicePropertiesTable: ServicePropertiesTableService,
    private readonly invoiceDiscountsTable: InvoiceDiscountsTableService,
    private readonly transactionService: TransactionsService,
    private readonly serviceService: ServiceService,
  ) {}

  //create service instance
  async createServiceInstance(
    userId: number,
    serviceTypeID: string,
    duration: number,
  ): Promise<string> {
    let expireDate = null;
    if (!isEmpty(duration)) {
      expireDate = addMonths(new Date(), duration);
    }
    const lastServiceInstanceId = await this.serviceInstancesTable.findOne({
      where: {
        userId: userId,
      },
      order: { index: -1 },
    });

    const index = lastServiceInstanceId ? lastServiceInstanceId.index + 1 : 0;
    const serviceType = await this.serviceTypeTable.findById(serviceTypeID);
    const dto: CreateServiceInstancesDto = {
      id: 1,
      userId: userId,
      serviceType: serviceType,
      status: 1,
      createDate: new Date(),
      lastUpdateDate: new Date(),
      expireDate: expireDate,
      index: index,
    };
    const service = await this.serviceInstancesTable.create(dto);
    return service.id;
  }

  //checks if any of service params is not sent by client
  async runScript(
    path: string,
    services: any,
    serviceInstanceId: string,
    data: any,
    itemTypes: any,
    options: any,
  ): Promise<any> {
    const script: any = await importScript(path);
    console.log(script);
    return new script(services, serviceInstanceId, data, itemTypes, options);
  }

  // create billing service
  // moved from services/creteservice.js
  async createBillingService(data, options, serviceId) {
    let totalCosts = null;
    const unlimitedService = 0;
    const userId = options.user.id;
    const checkParams = this.serviceChecksService.checkServiceParams(data, [
      'qualityPlanCode',
      'duration',
    ]);
    if (checkParams) {
      throw new InvalidServiceParamsException();
    }
    const serviceType = await this.serviceTypeTable.findOne({
      where: { ID: serviceId },
    });
    //check validity of serviceId
    if (isEmpty(serviceType)) {
      throw new InvalidServiceIdException();
    }
    const isMaxAvailable = await this.serviceChecksService.checkMaxService(
      unlimitedService,
      serviceType.maxAvailable,
      serviceId,
      userId,
    );
    if (!isMaxAvailable) {
      throw new MaxAvailableServiceException();
    }
    let discount = await this.discountsTable.findOne({
      where: {
        and: [{ ServiceTypeID: serviceId }, { Code: data.disocuntCode }],
      },
    });
    if (isEmpty(discount)) {
      throw new InvalidDiscountIdException();
    }
    const discountId = discount.id;
    if (discount.isBuiltIn || isEmpty(discountId)) {
      discount = null;
    }

    const qualityPlan = await this.qualityPlansService.findOne({
      where: { ServiceTypeID: serviceId, Code: data.qualityPlanCode },
    });

    // checks if qualityPlan id is correct
    if (isEmpty(qualityPlan)) {
      throw new InvalidQualityPlanException();
    }

    const builtInDiscount = await this.discountsService.findBuiltInDiscount(
      data.duration,
    );
    const costs = new Costs();
    let itemTypes = null;
    const token = null;
    throw new InternalServerErrorException('Must be resolved');
    if (serviceId == 'aradAi') {
      const JWT_SECRET_KEY = aradAIConfig.JWT_SECRET_KEY;

      // Should  be resolved
      // we should not acccess aiservice here

      // const serviceAiInfo = await this.aiService.getAiServiceInfo(userId, serviceId, qualityPlan.Code, data.duration);
      // const jwt = require('jsonwebtoken');
      //  token =  jwt.sign(serviceAiInfo, JWT_SECRET_KEY);
      //  totalCosts = costs.totalCostsAi(parseInt(serviceAiInfo['costPerMonth']), discount, qualityPlan, builtInDiscount, data.duration);
    } else {
      itemTypes = await this.itemTypesTable.find({
        where: { ServiceTypeID: serviceId },
      });

      const serviceItemsSum = await this.serviceItemsSumService.find({});

      const checkItems = await this.serviceChecksService.checkServiceItems(
        data,
        itemTypes,
        serviceItemsSum,
      );
      if (checkItems) {
        throw new InvalidServiceParamsException();
        // const error = new HttpExceptions().invalidServiceParams(checkItems)
      }
      totalCosts = costs.totalCosts(
        data,
        discount,
        qualityPlan,
        itemTypes,
        data.duration,
        builtInDiscount,
      );
    }
    const checkCredit = await this.userService.checkUserCredit(
      totalCosts.finalAmount,
      userId,
      options,
      serviceType.id,
    );
    if (!checkCredit) {
      throw new NotEnoughCreditException();
    }
    const serviceInstanceId = await this.createServiceInstance(
      userId,
      serviceId,
      data.duration,
    );
    const invoiceId = await this.invoiceService.createInvoice(
      userId,
      serviceInstanceId,
      totalCosts,
      qualityPlan.ID,
      true,
    );

    if (serviceId == 'aradAi') {
      await this.servicePropertiesTable.create({
        serviceInstanceId: serviceInstanceId,
        propertyKey: serviceId + '.token',
        value: token,
      });
    } else {
      await this.serviceService.createServiceItems(
        serviceInstanceId,
        itemTypes,
        data,
      );
      await this.invoiceService.createInvoiceItems(invoiceId, itemTypes, data);
    }

    if (!isEmpty(discount)) {
      await this.invoiceDiscountsTable.create({
        invoiceId: invoiceId,
        discountId: discount.id,
      });
    }
    if (!isEmpty(builtInDiscount)) {
      await this.invoiceDiscountsTable.create({
        invoiceId: invoiceId,
        discountId: builtInDiscount.id,
      });
    }

    await this.transactionService.createTransaction(
      totalCosts.finalAmount,
      invoiceId,
      serviceType.title,
      userId,
    );

    if (serviceId == 'aradAi') {
      return token;
    }
    return Promise.resolve({
      scriptPath: serviceType.createInstanceScript,
      serviceInstanceId,
      itemTypes,
    });
  }
}
