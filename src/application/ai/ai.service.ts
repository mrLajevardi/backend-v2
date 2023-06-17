import { Injectable } from '@nestjs/common';
import { InvalidTokenException } from 'src/infrastructure/exceptions/invalid-token.exception';
import { UserService } from '../base/user/user/user.service';
import { ServicePropertiesService } from '../base/service/service-properties/service-properties.service';
import { isEmpty } from 'class-validator';
import { ServiceInstancesService } from '../base/service/service-instances/service-instances.service';
import { NotEnoughCreditException } from 'src/infrastructure/exceptions/not-enough-credit.exception';
import { InvalidUseRequestPerDayException } from 'src/infrastructure/exceptions/invalid-use-request-per-day.exception';
import { InvalidUseRequestPerMonthException } from 'src/infrastructure/exceptions/invalid-use-request-per-month.exception';
import { AiTransactionsLogsService } from '../base/service/ai-transactions-logs/ai-transactions-logs.service';
import { SettingService } from '../base/security/setting/setting.service';
import { InvalidServiceInstanceIdException } from 'src/infrastructure/exceptions/invalid-service-instance-id.exception';
import {
  addMonths,
  dayDiff,
  monthDiff,
} from 'src/infrastructure/helpers/date-time.helper';
import { ConfigsService } from '../base/service/configs/configs.service';
import { InvalidAradAIConfigException } from 'src/infrastructure/exceptions/invalid-arad-ai-config.exception';
import aradAIConfig from 'src/infrastructure/config/aradAIConfig';
import jwt from 'jsonwebtoken';

@Injectable()
export class AiService {
  constructor(
    private readonly userService: UserService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly serviceInstancesService: ServiceInstancesService,
    private readonly aiTransactionLogsService: AiTransactionsLogsService,
    private readonly settingService: SettingService,
    private readonly configsService: ConfigsService,
  ) {}

  async verifyToken(token: string) {
    const JWT_SECRET_KEY = aradAIConfig.JWT_SECRET_KEY;
    return jwt.verify(token, JWT_SECRET_KEY);
  }

  async checkAIToken(token: string): Promise<boolean> {
    return false;
    const verified = await this.verifyToken(token)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw new InvalidTokenException(err);
      });

    if (!verified) {
      throw new InvalidTokenException();
    }

    const userId = verified['userId'];
    const user = await this.userService.findById(userId);

    const expireDate = new Date(verified['expireDate']);
    const currentDate = new Date();
    if (expireDate < currentDate) {
      throw new InvalidTokenException();
    }

    const serviceProperties = await this.servicePropertiesService.findOne({
      where: {
        and: [
          { Value: { like: '%' + token + '%' } },
          { PropertyKey: { like: '%aradAi%' } },
        ],
      },
    });

    if (isEmpty(serviceProperties)) {
      throw new InvalidTokenException();
    }

    const serviceInstance = await this.serviceInstancesService.findOne({
      where: {
        ID: serviceProperties.serviceInstanceId,
      },
    });

    if (
      isEmpty(verified['costPerRequest']) ||
      isEmpty(verified['createdDate']) ||
      (verified['qualityPlanCode'] != 'demo' &&
        (serviceInstance.isDisabled || serviceInstance.isDeleted))
    ) {
      throw new InvalidTokenException();
    }
    const constPerRequest = parseInt(verified['costPerRequest']);

    if (constPerRequest > user.credit) {
      throw new NotEnoughCreditException();
    }
    if (verified['qualityPlanCode'] == 'demo') {
      // Muximum use per day
      const usePerDay = await this.usedPerDay(
        serviceProperties.serviceInstanceId,
      );
      if (
        verified['maxRequestPerDay'] != 'unlimited' &&
        verified['maxRequestPerDay'] < usePerDay
      ) {
        throw new InvalidUseRequestPerDayException();
      }
      // Muximum use pre month
      const usePerMonth = await this.usedPerMonth(
        serviceProperties.serviceInstanceId,
        verified['createdDate'],
      );
      if (
        verified['maxRequestPerMonth'] != 'unlimited' &&
        verified['maxRequestPerMonth'] < usePerMonth
      ) {
        throw new InvalidUseRequestPerMonthException();
      }
    }
    return true;
  }

  async usedPerDay(serviceInstanceId: string) {
    const todayDate = new Date().toISOString().slice(0, 10);
    return await this.aiTransactionLogsService.count({
      where: {
        and: [
          { ServiceInstanceID: serviceInstanceId },
          { DateTime: { gte: todayDate + 'T00:00:00' } },
          { DateTime: { lte: todayDate + 'T23:11:59' } },
        ],
      },
    });
  }

  async usedPerMonth(serviceInstanceId: string, createdDate: Date) {
    const todayDate = new Date().toISOString().slice(0, 10);
    const difference = monthDiff(new Date(createdDate), new Date(todayDate));
    const fromDay = new Date(addMonths(createdDate, difference))
      .toISOString()
      .slice(0, 10);
    const endDay = addMonths(createdDate, difference + 1)
      .toISOString()
      .slice(0, 10);

    return await this.aiTransactionLogsService.count({
      where: {
        and: [
          { ServiceInstanceID: serviceInstanceId },
          { DateTime: { gte: fromDay + 'T00:00:00' } },
          { DateTime: { lte: endDay + 'T23:11:59' } },
        ],
      },
    });
  }

  async allRequestused(serviceInstanceID) {
    return await this.aiTransactionLogsService.count({
      where: {
        serviceInstanceId: serviceInstanceID,
      },
    });
  }

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
  }

  async createDemoToken(userId, token) {
    return await this.settingService.create({
      userId: userId,
      key: 'aradAi.tokenDemo',
      value: token,
      insertTime: new Date(),
      updateTime: new Date(),
    });
  }

  async getAradAIDashboard(userId: number, serviceInstanceId: string) {
    const serviceProperties = await this.servicePropertiesService.findOne({
      where: { ServiceInstanceID: serviceInstanceId },
    });

    if (isEmpty(serviceProperties)) {
      throw new InvalidServiceInstanceIdException();
    }

    const token = serviceProperties.value;
    const verified = await this.verifyToken(token)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
    if (!verified) {
      throw new InvalidTokenException();
    }
    const user = await this.userService.findById(userId);
    const usePerDay = await this.usedPerDay(serviceInstanceId);
    const usePerMonth = await this.usedPerMonth(
      serviceInstanceId,
      verified.createdDate,
    );
    const remainingDays = await dayDiff(verified.expireDate);
    const numberOfServiceCalled =
      this.serviceInstancesService.spCountAradAiUsedEachService(
        serviceProperties.serviceInstanceId,
      );
    const allRequestuse = await this.allRequestused(
      serviceProperties.serviceInstanceId,
    );
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

  async getAiServiceInfo(userId, serviceId, qualityPlanCode, duration) {
    const aiServiceConfigs = await this.configsService.find({
      where: {
        and: [
          { PropertyKey: { like: '%' + qualityPlanCode + '%' } },
          { ServiceTypeID: serviceId },
        ],
      },
    });
    const ServiceAiInfo = {
      qualityPlanCode,
      createdDate: new Date().toISOString(),
      userId,
      duration,
      expireDate: addMonths(new Date(), duration),
    };
    if (isEmpty(aiServiceConfigs)) {
      throw new InvalidAradAIConfigException();
    }

    aiServiceConfigs.forEach((element) => {
      const key = element.propertyKey.split('.').slice(-1)[0];
      const item = element.value;
      ServiceAiInfo[key] = item;
    });
    return ServiceAiInfo;
  }
}
