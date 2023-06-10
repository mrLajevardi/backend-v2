import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceInstances } from 'src/infrastructure/database/entities/ServiceInstances';
import { CreateServiceInstancesDto } from 'src/application/base/service-instances/dto/create-service-instances.dto';
import { UpdateServiceInstancesDto } from 'src/application/base/service-instances/dto/update-service-instances.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { DatabaseErrorException } from 'src/infrastructure/exceptions/database-error.exception';
import { isEmpty } from 'class-validator';
import { ServiceTypesService } from '../service-types/service-types.service';
import { addMonths } from 'src/infrastructure/helpers/date-time.helper';
import { InvalidServiceParamsException } from 'src/infrastructure/exceptions/invalid-service-params.exception';
import { InvalidServiceIdException } from 'src/infrastructure/exceptions/invalid-service-id.exception';
import { MaxAvailableServiceException } from 'src/infrastructure/exceptions/max-available-service.exception';
import { DiscountsService } from '../discounts/discounts.service';
import { InvalidDiscountIdException } from 'src/infrastructure/exceptions/invalid-discount-id.exception';
import { AiService } from 'src/application/ai/ai.service';
import { ItemTypesService } from '../item-types/item-types.service';
import { InvalidQualityPlanException } from 'src/infrastructure/exceptions/invalid-quality-plan.exception';
import Costs from './classes/costs';
import { isNil } from 'lodash';
import { NotEnoughCreditException } from 'src/infrastructure/exceptions/not-enough-credit.exception';
import { InvoicesService } from '../invoices/invoices.service';
import { ServicePropertiesService } from '../service-properties/service-properties.service';
import { ServiceItemsService } from '../service-items/service-items.service';
import { InvoiceItemsService } from '../invoice-items/invoice-items.service';
import { UserService } from '../user/user.service';
import { CreateInvoiceDto } from '../invoices/dto/create-invoice.dto';
import { InvoiceDiscountsService } from '../invoice-discounts/invoice-discounts.service';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class ServiceInstancesService {
  constructor(
    @InjectRepository(ServiceInstances)
    private readonly repository: Repository<ServiceInstances>,
    private readonly serviceTypeService: ServiceTypesService,
    private readonly discountsService : DiscountsService
  ) {}

  // Find One Item by its ID
  async findById(id: string): Promise<ServiceInstances> {
    const serviceType = await this.repository.findOne({ where: { id: id } });
    return serviceType;
  }

  // Find Items using search criteria
  async find(options?: FindManyOptions): Promise<ServiceInstances[]> {
    const result = await this.repository.find(options);
    return result;
  }

  // Exec Sp_CountAradAIUsedEachService
  async spCountAradAiUsedEachService(instanceId: string): Promise<number> {
    const query =
      "EXEC Sp_CountAradAIUsedEachService @ServiceInstanceID='" +
      instanceId +
      "'";
    try {
      const result = await this.repository.query(query);
      return result;
    } catch (err) {
      throw new DatabaseErrorException('sp_count problem', err);
    }
  }

  // Count the items
  async count(options?: FindManyOptions): Promise<number> {
    const result = await this.repository.count(options);
    return result;
  }

  // Find one item
  async findOne(options?: FindOneOptions): Promise<ServiceInstances> {
    const result = await this.repository.findOne(options);
    return result;
  }

  // Create an Item using createDTO
  async create(dto: CreateServiceInstancesDto) {
    const newItem = plainToClass(ServiceInstances, dto);
    const createdItem = this.repository.create(newItem);
    const result = await this.repository.save(createdItem);
    return result;
  }

  //create service instance
  async createServiceInstance(
    userId: number,
    serviceTypeID: string,
    duration: number,
  ) : Promise<string> {
    let expireDate = null;
    if (!isEmpty(duration)) {
      expireDate = addMonths(new Date(), duration);
    }
    const lastServiceInstanceId = await this.findOne({
      where: {
        UserID: userId,
      },
      order: { Index: -1 },
    });

    const index = lastServiceInstanceId ? lastServiceInstanceId.index + 1 : 0;
    let dto: CreateServiceInstancesDto;
    const serviceType = await this.serviceTypeService.findById(serviceTypeID);
    dto = {
      id: 1,
      userId: userId,
      serviceType: serviceType,
      status: 1,
      createDate: new Date(),
      lastUpdateDate: new Date(),
      expireDate: expireDate,
      index: index,
    };
    const service = await this.create(dto);
    return service.id ;
  }

  // Update an Item using updateDTO
  async update(id: string, dto: UpdateServiceInstancesDto) {
    const item = await this.findById(id);
    const updateItem: Partial<ServiceInstances> = Object.assign(item, dto);
    await this.repository.save(updateItem);
  }

  // delete an Item
  async delete(id: string) {
    await this.repository.delete(id);
  }

  // delete all items
  async deleteAll() {
    await this.repository.delete({});
  }

  // Moved from service checks
  checkServiceParams(data, keys) {
    let status = 0;
    const errorDetail = {
      codes: {},
    };
    for (const key of keys) {
      if (isEmpty(data[key])) {
        errorDetail.codes[key] = [new InvalidServiceParamsException()];
        status = 1;
      }
    }
    if (status) {
      return errorDetail;
    }
    return null;
  };

  // Moved from service checks
  async checkMaxService(unlimitedMax, serviceMaxAvailable, serviceId, userId) {
    // checks max service
    const userServiceCount = await this.count({
      where : {
        and: [
          {UserID: userId},
          {ServiceTypeID: serviceId},
        ],
      }
    });
    if (serviceMaxAvailable <= userServiceCount && serviceMaxAvailable !== unlimitedMax) {
      return false;
    }
    return true;
  };

  // Moved from service checks 
  async checkServiceItems(data, items, serviceItemsSum) {
    const itemsList = [];
    const errorDetail = {
      codes: {},
    };
    for (const item of Object.keys(items)) {
      itemsList.push(items[item].Title);
    }
    let status = 0;
    for (const item of itemsList) {
      if (! data[item] || typeof data[item] !== 'number') {
        // MUST BE REVIEWd
        errorDetail.codes[item] = [new InvalidServiceParamsException('absense')];
        status = 1;
      }
    }
    for (const item of itemsList) {
      const itemSum = serviceItemsSum.find((itemSum) => itemSum.id == item);
      const sum = ! isNil(itemSum) ? itemSum.Sum + data[item] : data[item];
      if (
        (sum > items[itemsList.indexOf(item)].MaxAvailable &&
         items[itemsList.indexOf(item)].MaxAvailable !== 0)) {
        if (! errorDetail.codes[item]) {
          errorDetail.codes[item] = [new InvalidServiceParamsException('max_available')];
        } else {
          errorDetail.codes[item].push(new InvalidServiceParamsException('max_per_request'));
        }
        status = 1;
      }
      // checks maxPerRequest
      if (parseInt(data[item]) > parseInt(items[itemsList.indexOf(item)].MaxPerRequest)) {
        if (! errorDetail.codes[item]) {
          // if errorDetails.codes[item] does not exist
          errorDetail.codes[item] = [new InvalidServiceParamsException('max_per_request')];
        } else {
          // if errorDetails.codes[item] does exist
          errorDetail.codes[item].push(new InvalidServiceParamsException('max_per_request'));
        }
        status = 1;
      }
    }
    if (status) {
      return errorDetail;
    }
    return null;
  };



  // create billing service 
  // moved from services/creteservice.js
  async createBillingService(data, options, serviceId) {
    let totalCosts = null
    const unlimitedService = 0
    const userId = options.accessToken.userId
    const checkParams = this.checkServiceParams(data, ["qualityPlanCode", "duration"])
    if (checkParams) {
      throw new InvalidServiceParamsException();
    }
    const serviceType = await this.serviceTypeService.findOne({
        where:{ID: serviceId}
    })
    //check validity of serviceId
    if (isEmpty(serviceType)) {
      throw new InvalidServiceIdException();
    }
    const isMaxAvailable= await this.checkMaxService(unlimitedService, serviceType.maxAvailable, serviceId, userId)
    if (! isMaxAvailable) {
      throw new MaxAvailableServiceException(); 
    }
    let discount = await this.discountsService.findOne({
        where:{
            and:[
                {ServiceTypeID : serviceId}, 
                {Code : data.disocuntCode}
            ]
        } 
    })
    if (isEmpty(discount)) {
      throw new InvalidDiscountIdException();
    }
    const discountId = discount.id;
    if (discount.isBuiltIn || isEmpty(discountId)) {
        discount = null
    }
    /** Should be implemented  */
throw(new InternalServerErrorException('complete the code and remove comments '));
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
throw(new InternalServerErrorException('complete the code and remove comments '));
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
