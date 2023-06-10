import { Injectable } from '@nestjs/common';
import { invalidToken } from 'src/infrastructure/exceptions/invalid-token.exception';
import { UserService } from '../base/user/user.service';
import { ServicePropertiesService } from '../base/service-properties/service-properties.service';
import { isEmpty } from 'class-validator';
import { ServiceInstancesService } from '../base/service-instances/service-instances.service';
import { NotEnoughCreditException } from 'src/infrastructure/exceptions/not-enough-credit.exception';
import { invalidUseRequestPerDay } from 'src/infrastructure/exceptions/invalid-use-request-per-day.exception';
import { invalidUseRequestPerMonth } from 'src/infrastructure/exceptions/invalid-use-request-per-month.exception';
import { AiTransactionsLogsService } from '../base/ai-transactions-logs/ai-transactions-logs.service';
import { SettingService } from '../base/setting/setting.service';
import { invalidServiceInstanceID } from 'src/infrastructure/exceptions/invalid-service-instance-id.exception';
import { addMonths, dayDiff, monthDiff } from 'src/infrastructure/helpers/date-time.helper';

@Injectable()
export class AiService {
  constructor(
    private readonly userService: UserService,
    private readonly servicePropertiesService : ServicePropertiesService,
    private readonly serviceInstancesService : ServiceInstancesService,
    private readonly aiTransactionLogsService : AiTransactionsLogsService,
    private readonly settingService : SettingService,
    ) {}

  async verifyToken(token: string) {
    const JWT_SECRET_KEY =
      require('src/infrastructure/config/aradAIConfig.js').JWT_SECRET_KEY;
    const jwt = require('jsonwebtoken');
    return await jwt.verify(token, JWT_SECRET_KEY);
  }

  async checkAIToken(token: string) : Promise<boolean> {
    const verified = await this.verifyToken(token)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw new invalidToken(err);
      });

    if (!verified) {
      throw new invalidToken();
    }

    const userId = verified.userId;
    const user = await this.userService.findById(userId);

    const expireDate = new Date(verified.expireDate);
    const currentDate = new Date();
    if (expireDate < currentDate) {
      throw new invalidToken();
    }

    const serviceProperties = await this.servicePropertiesService.findOne({
      where:
      {
        and: [
          {Value: {like: '%'+token+'%'}},
          {PropertyKey: {like: '%aradAi%'}},
        ],
      },
    });
    
    if (isEmpty(serviceProperties)) {
      throw new invalidToken();
    }

    const serviceInstance = await this.serviceInstancesService.findOne({
      where: {
        ID: serviceProperties.serviceInstanceId,
      },
    });

    if (isEmpty(verified.costPerRequest) || isEmpty(verified.createdDate) ||
    (verified.qualityPlanCode != 'demo'&& (serviceInstance.isDisabled || serviceInstance.isDeleted))) {
      throw new invalidToken(); 
    }
    const constPerRequest = parseInt(verified.costPerRequest);

    if (constPerRequest > user.credit) {
      throw new NotEnoughCreditException(); 
    }
    if (verified.qualityPlanCode == 'demo') {
      // Muximum use per day
      const usePerDay = await this.usedPerDay(serviceProperties.serviceInstanceId);
      if (verified.maxRequestPerDay != 'unlimited' && verified.maxRequestPerDay < usePerDay) {
        throw new invalidUseRequestPerDay();
      }
      // Muximum use pre month
      const usePerMonth = await this.usedPerMonth(serviceProperties.serviceInstanceId, verified.createdDate);
      if (verified.maxRequestPerMonth != 'unlimited' && verified.maxRequestPerMonth < usePerMonth) {
        throw new invalidUseRequestPerMonth();
      }
    }
    return true;; 
  };


  async usedPerDay(serviceInstanceId : string) {
    const todayDate = new Date().toISOString().slice(0, 10);
    return await this.aiTransactionLogsService.count({
      where: {
        and: [
          {ServiceInstanceID: serviceInstanceId},
          {DateTime: {'gte': todayDate + 'T00:00:00'}},
          {DateTime: {'lte': todayDate + 'T23:11:59'}},
        ],
      }
    });    
  }

  async usedPerMonth(serviceInstanceId : string , createdDate : Date ) {
    const todayDate = new Date().toISOString().slice(0, 10);
    const difference = monthDiff(new Date(createdDate), new Date(todayDate));
    const fromDay = new Date(addMonths(createdDate, difference)).toISOString().slice(0, 10);
    const endDay = addMonths(createdDate, difference + 1).toISOString().slice(0, 10);
  
    return await this.aiTransactionLogsService.count({
      where : {
        and: [
          {ServiceInstanceID: serviceInstanceId},
          {DateTime: {'gte': fromDay + 'T00:00:00'}},
          {DateTime: {'lte': endDay + 'T23:11:59'}},
        ],
      }
    });
  };
  

  async allRequestused (serviceInstanceID) {
    return await this.aiTransactionLogsService.count({
      where: {
        serviceInstanceId: serviceInstanceID,
      }
    });
  };
  

  sumAllServiceUsed(eachServiceUsed) {
    let numberOfAllServiceUsed = 0;
    eachServiceUsed.forEach((service) => {
      for (const key in service) {
        if (key == 'used') {
          numberOfAllServiceUsed += service[key];
        }
      }
    });
    return numberOfAllServiceUsed;
  };
  
  async createDemoToken(userId, token){
    return await this.settingService.create({
      userId: userId,
      key: 'aradAi.tokenDemo',
      value: token,
      insertTime: new Date(),
      updateTime: new Date(),
    });
  };
  


  async getAradAIDashboard(userId : number , serviceInstanceId : string ) {
    const serviceProperties = await this.servicePropertiesService.findOne({
      where: {ServiceInstanceID: serviceInstanceId},
    });

    if (isEmpty(serviceProperties)) {
      throw new invalidServiceInstanceID();
    }

    const token = serviceProperties.value;
    const verified = await this.verifyToken(token).then((res) => {
      return res;
    }).catch((err) => {
      return err;
    });
    if (!verified) {
      throw new invalidToken(); 
    }
    const user = await this.userService.findById(userId);
    const usePerDay = await this.usedPerDay(serviceInstanceId);
    const usePerMonth = await this.usedPerMonth(serviceInstanceId, verified.createdDate);
    const remainingDays = await dayDiff(verified.expireDate);
    const numberOfServiceCalled = this.serviceInstancesService.spCountAradAiUsedEachService(serviceProperties.serviceInstanceId);
    const allRequestuse = await this.allRequestused(serviceProperties.serviceInstanceId);
    const constPerRequest = parseInt(verified.costPerRequest);
    const creditUsed = allRequestuse * constPerRequest;
    const creditRemaining = user.credit;
    return {
      token,
      usedPerDay: usePerDay,
      allRequestused: allRequestuse,
      usedPerMonth: usePerMonth,
      creditUsed,
      creditRemaining,
      remainingDays,
      numberOfServiceCalled: numberOfServiceCalled,
      QualityPlan: verified,
    };
  }
}
