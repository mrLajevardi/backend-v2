import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { addMonths } from 'src/infrastructure/helpers/date-time.helper';
import { ServiceTypesService } from 'src/application/base/service/service-types/service-types.service';
import { DiscountsService } from 'src/application/base/service/discounts/discounts.service';
import { ServiceInstancesService } from '../service-instances.service';
import { CreateServiceInstancesDto } from '../../dto/create-service-instances.dto';
import { ServiceChecksService } from '../service-checks/service-checks.service';
import { InvalidServiceParamsException } from 'src/infrastructure/exceptions/invalid-service-params.exception';
import { InvalidServiceIdException } from 'src/infrastructure/exceptions/invalid-service-id.exception';
import { MaxAvailableServiceException } from 'src/infrastructure/exceptions/max-available-service.exception';
import { InvalidDiscountIdException } from 'src/infrastructure/exceptions/invalid-discount-id.exception';
import { QualityPlansService } from 'src/application/base/service/quality-plans/quality-plans.service';
import { InvalidQualityPlanException } from 'src/infrastructure/exceptions/invalid-quality-plan.exception';
import Costs from '../../classes/costs';
import aradAIConfig from 'src/infrastructure/config/aradAIConfig';

import { AiService } from 'src/application/ai/ai.service';
import { ItemTypesService } from 'src/application/base/service/item-types/item-types.service';
import { ServiceItemsSumService } from 'src/application/base/service/service-items-sum/service-items-sum.service';
import { UserService } from 'src/application/base/user/user/user.service';
import { NotEnoughCreditException } from 'src/infrastructure/exceptions/not-enough-credit.exception';
import { InvoicesService } from 'src/application/base/invoice/invoices/service/invoices.service';
import { InvoicePropertiesService } from 'src/application/base/invoice/invoice-properties/invoice-properties.service';
import { ServicePropertiesService } from 'src/application/base/service/service-properties/service-properties.service';
import { ServiceItemsService } from 'src/application/base/service/service-items/service-items.service';
import { InvoiceItemsService } from 'src/application/base/invoice/invoice-items/invoice-items.service';
import { InvoiceDiscountsService } from 'src/application/base/invoice/invoice-discounts/invoice-discounts.service';
import { TransactionsService } from 'src/application/base/transactions/transactions.service';

@Injectable()
export class CreateServiceService {
  constructor(
    private readonly serviceTypeService: ServiceTypesService,
    private readonly discountsService: DiscountsService,
    private readonly serviceInstancesService: ServiceInstancesService,
    private readonly serviceChecksService: ServiceChecksService,
    private readonly qualityPlansService: QualityPlansService,
    private readonly itemTypesService: ItemTypesService,
    private readonly serviceItemsSumService: ServiceItemsSumService, 
    private readonly userService: UserService,
    private readonly invoiceService: InvoicesService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly serviceItemsService: ServiceItemsService,
    private readonly invoiceItemsService: InvoiceItemsService,
    private readonly invoiceDiscountsService: InvoiceDiscountsService, 
    private readonly transactionService: TransactionsService,
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
    const lastServiceInstanceId = await this.serviceInstancesService.findOne({
      where: {
        UserID: userId,
      },
      order: { Index: -1 },
    });

    const index = lastServiceInstanceId ? lastServiceInstanceId.index + 1 : 0;
    const serviceType = await this.serviceTypeService.findById(serviceTypeID);
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
    const service = await this.serviceInstancesService.create(dto);
    return service.id;
  }

  //checks if any of service params is not sent by client
  runScript(
    path: string,
    services: any,
    serviceInstanceId: string,
    data: any,
    itemTypes: any,
    options: any,
  ): any {
    const script: any = require(path);
    console.log(script);
    return new script(services, serviceInstanceId, data, itemTypes, options);
  }

  // create billing service
  // moved from services/creteservice.js
  async createBillingService(data, options, serviceId) {
    let totalCosts = null;
    const unlimitedService = 0;
    const userId = options.accessToken.userId;
    const checkParams = this.serviceChecksService.checkServiceParams(data, [
      'qualityPlanCode',
      'duration',
    ]);
    if (checkParams) {
      throw new InvalidServiceParamsException();
    }
    const serviceType = await this.serviceTypeService.findOne({
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
    let discount = await this.discountsService.findOne({
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
        where: {ServiceTypeID : serviceId, Code: data.qualityPlanCode}
    })

    // checks if qualityPlan id is correct
    if (isEmpty(qualityPlan)) {
      throw new InvalidQualityPlanException();
    }

    const builtInDiscount = await this.discountsService.findBuiltInDiscount(data.duration)
    const costs = new Costs()
    let itemTypes = null;
    let token = null;
    throw new InternalServerErrorException("Must be resolved");
    if (serviceId == 'aradAi') {
      const JWT_SECRET_KEY =
      aradAIConfig.JWT_SECRET_KEY;

      // Should  be resolved
      // we should not acccess aiservice here
      
     // const serviceAiInfo = await this.aiService.getAiServiceInfo(userId, serviceId, qualityPlan.Code, data.duration);
     // const jwt = require('jsonwebtoken');
    //  token =  jwt.sign(serviceAiInfo, JWT_SECRET_KEY);
    //  totalCosts = costs.totalCostsAi(parseInt(serviceAiInfo['costPerMonth']), discount, qualityPlan, builtInDiscount, data.duration);
    }
    else {
        itemTypes = await this.itemTypesService.find({
            where:{ ServiceTypeID : serviceId}
        })

     const serviceItemsSum = await this.serviceItemsSumService.find({})

        const checkItems = await this.serviceChecksService.checkServiceItems(data, itemTypes, serviceItemsSum)
        if (checkItems) {
          throw(new InvalidServiceParamsException());
            // const error = new HttpExceptions().invalidServiceParams(checkItems)
        }
        totalCosts = costs.totalCosts(data, discount, qualityPlan, itemTypes, data.duration, builtInDiscount)
    }
    const checkCredit = await this.userService.checkUserCredit(totalCosts.finalAmount, userId, options, serviceType.id)
    if (! checkCredit) {
      throw new NotEnoughCreditException();
    }
    const serviceInstanceId = await this.createServiceInstance(userId, serviceId, data.duration)
    const invoiceId = await this.invoiceService.createInvoice(userId, serviceInstanceId, totalCosts, qualityPlan.ID, true)

    if (serviceId == 'aradAi') {
        await this.servicePropertiesService.create({
            serviceInstanceId: serviceInstanceId,
            propertyKey: serviceId+'.token',
            value: token
        });
    } else {
        await this.serviceItemsService.createServiceItems(serviceInstanceId, itemTypes, data)
        await this.invoiceItemsService.createInvoiceItems(invoiceId, itemTypes, data)
    }

    if (! isEmpty(discount)) {
        await this.invoiceDiscountsService.create({invoiceId : invoiceId, discountId: discount.id})
    }
    if(! isEmpty(builtInDiscount)){
        await this.invoiceDiscountsService.create({invoiceId : invoiceId, discountId: builtInDiscount.id})
    }

    await this.transactionService.createTransaction(totalCosts.finalAmount, invoiceId, serviceType.title , userId)

    if (serviceId == 'aradAi') {
        return token;
    }
    return Promise.resolve({
    scriptPath: serviceType.createInstanceScript,serviceInstanceId, itemTypes
    })
  }
}
