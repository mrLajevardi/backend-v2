import { Injectable } from '@nestjs/common';
import { InvalidTokenException } from 'src/infrastructure/exceptions/invalid-token.exception';
import { isEmpty } from 'class-validator';
import { NotEnoughCreditException } from 'src/infrastructure/exceptions/not-enough-credit.exception';
import { InvalidUseRequestPerDayException } from 'src/infrastructure/exceptions/invalid-use-request-per-day.exception';
import { InvalidUseRequestPerMonthException } from 'src/infrastructure/exceptions/invalid-use-request-per-month.exception';
import { InvalidServiceInstanceIdException } from 'src/infrastructure/exceptions/invalid-service-instance-id.exception';
import {
  addMonths,
  dayDiff,
  monthDiff,
} from 'src/infrastructure/helpers/date-time.helper';
import { InvalidAradAIConfigException } from 'src/infrastructure/exceptions/invalid-arad-ai-config.exception';
import aradAIConfig from 'src/infrastructure/config/aradAIConfig';
import jwt from 'jsonwebtoken';
import { UserTableService } from '../base/crud/user-table/user-table.service';
import { ConfigsTableService } from '../base/crud/configs-table/configs-table.service';
import { SettingTableService } from '../base/crud/setting-table/setting-table.service';
import { AITransactionsLogsTableService } from '../base/crud/aitransactions-logs-table/aitransactions-logs-table.service';
import { ServiceInstancesTableService } from '../base/crud/service-instances-table/service-instances-table.service';
import { ServicePropertiesTableService } from '../base/crud/service-properties-table/service-properties-table.service';
import { ServiceInstancesStoredProcedureService } from '../base/crud/service-instances-table/service-instances-stored-procedure.service';

@Injectable()
export class AiService {
  constructor(
    private readonly userTable: UserTableService,
    private readonly servicePropertiesTable: ServicePropertiesTableService,
    private readonly serviceInstancesTable: ServiceInstancesTableService,
    private readonly aiTransactionLogsTable: AITransactionsLogsTableService,
    private readonly settingTable: SettingTableService,
    private readonly configsTable: ConfigsTableService,
    private readonly serviceInstancesSP: ServiceInstancesStoredProcedureService,
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
    const user = await this.userTable.findById(userId);

    const expireDate = new Date(verified['expireDate']);
    const currentDate = new Date();
    if (expireDate < currentDate) {
      throw new InvalidTokenException();
    }

    const serviceProperties = await this.servicePropertiesTable.findOne({
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

    const serviceInstance = await this.serviceInstancesTable.findOne({
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
    return await this.aiTransactionLogsTable.count({
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

    return await this.aiTransactionLogsTable.count({
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
    return await this.aiTransactionLogsTable.count({
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
    return await this.settingTable.create({
      userId: userId,
      key: 'aradAi.tokenDemo',
      value: token,
      insertTime: new Date(),
      updateTime: new Date(),
    });
  }

  async getAradAIDashboard(userId: number, serviceInstanceId: string) {
    const serviceProperties = await this.servicePropertiesTable.findOne({
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
    const user = await this.userTable.findById(userId);
    const usePerDay = await this.usedPerDay(serviceInstanceId);
    const usePerMonth = await this.usedPerMonth(
      serviceInstanceId,
      verified.createdDate,
    );
    const remainingDays = await dayDiff(verified.expireDate);
    const numberOfServiceCalled =
      this.serviceInstancesSP.spCountAradAiUsedEachService(
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
    const aiServiceConfigs = await this.configsTable.find({
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
