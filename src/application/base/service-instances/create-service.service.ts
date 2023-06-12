import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { addMonths } from 'src/infrastructure/helpers/date-time.helper';
import { ServiceTypesService } from '../service-types/service-types.service';
import { DiscountsService } from '../discounts/discounts.service';
import { ServiceInstancesService } from './service-instances.service';
import { CreateServiceInstancesDto } from './dto/create-service-instances.dto';
import { ServiceChecksService } from './service-checks.service';
import { InvalidServiceParamsException } from 'src/infrastructure/exceptions/invalid-service-params.exception';
import { InvalidServiceIdException } from 'src/infrastructure/exceptions/invalid-service-id.exception';
import { MaxAvailableServiceException } from 'src/infrastructure/exceptions/max-available-service.exception';
import { InvalidDiscountIdException } from 'src/infrastructure/exceptions/invalid-discount-id.exception';

@Injectable()
export class CreateServiceService {
  constructor(
    private readonly serviceTypeService: ServiceTypesService,
    private readonly discountsService: DiscountsService,
    private readonly serviceInstancesService: ServiceInstancesService,
    private readonly serviceChecksService: ServiceChecksService,
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
  runScript(path, services, serviceInstanceId, data, itemTypes, options){
    const script = require(path)
    console.log(script)
    return new script(services, serviceInstanceId, data, itemTypes, options)
  }

  // create billing service
  // moved from services/creteservice.js
  async createBillingService(data, options, serviceId) {
    const totalCosts = null;
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
    /** Should be implemented  */
    throw new InternalServerErrorException(
      'complete the code and remove comments ',
    );
    // const qualityPlan = await app.models.QualityPlans.findOne({
    //     where: {ServiceTypeID : serviceId, Code: data.qualityPlanCode}
    // })

    //checks if qualityPlan id is correct
    // if (isEmpty(qualityPlan)) {
    //   throw new InvalidQualityPlanException();
    // }

    // const builtInDiscount = await this.discountsService.findBuiltInDiscount(data.duration)
    // const costs = new Costs()
    // let itemTypes = null;
    // let token = null;
    // if (serviceId == 'aradAi') {
    //   const JWT_SECRET_KEY =
    //   require('src/infrastructure/config/aradAIConfig.js').JWT_SECRET_KEY;
    //   const serviceAiInfo = await this.aiService.getAiServiceInfo(userId, serviceId, qualityPlan.Code, data.duration);
    //   const jwt = require('jsonwebtoken');
    //   token =  jwt.sign(serviceAiInfo, JWT_SECRET_KEY);
    //   totalCosts = costs.totalCostsAi(parseInt(serviceAiInfo['costPerMonth']), discount, qualityPlan, builtInDiscount, data.duration);
    // }
    // else {
    //     itemTypes = await this.itemTypesService.find({
    //         where:{ ServiceTypeID : serviceId}
    //     })
    /** Should be implemented  */
    throw new InternalServerErrorException(
      'complete the code and remove comments ',
    );
    //  const serviceItemsSum = await app.models.ServiceItemsSum.find({})

    //     const checkItems = await this.checkServiceItems(data, itemTypes, serviceItemsSum)
    //     if (checkItems) {
    //       throw(new InvalidServiceParamsException());
    //         // const error = new HttpExceptions().invalidServiceParams(checkItems)
    //     }
    //     totalCosts = costs.totalCosts(data, discount, qualityPlan, itemTypes, data.duration, builtInDiscount)
    // }
    // const checkCredit = await this.userService.checkUserCredit(totalCosts.finalAmount, userId, options, serviceType.id)
    // if (! checkCredit) {
    //   throw new NotEnoughCreditException();
    // }
    // const serviceInstanceId = await this.createServiceInstance(userId, serviceId, data.duration)
    // const invoiceId = await this.invoiceService.createInvoice(userId, serviceInstanceId, totalCosts, qualityPlan.ID, true)

    // if (serviceId == 'aradAi') {
    //     await this.servicePropertiesService.create({
    //         serviceInstanceId: serviceInstanceId,
    //         propertyKey: serviceId+'.token',
    //         value: token
    //     });
    // } else {
    //     await this.serviceItemsService.createServiceItems(serviceInstanceId, itemTypes, data)
    //     await this.invoiceItemsService.createInvoiceItems(invoiceId, itemTypes, data)
    // }

    // if (! isEmpty(discount)) {
    //     await this.invoiceDiscountsService.create({invoiceId : invoiceId, discountId: discount.id})
    // }
    // if(! isEmpty(builtInDiscount)){
    //     await this.invoiceDiscountsService.create({invoiceId : invoiceId, discountId: builtInDiscount.id})
    // }

    // await this.transactionService.createTransaction(totalCosts.finalAmount, invoiceId, serviceType.title , userId)

    // if (serviceId == 'aradAi') {
    //     return token;
    // }
    // return Promise.resolve({
    // scriptPath: serviceType.CreateInstanceScript,serviceInstanceId, itemTypes
    // })
  }
}
