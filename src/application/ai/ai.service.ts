import { Injectable } from '@nestjs/common';
import { InvalidTokenException } from 'src/infrastructure/exceptions/invalid-token.exception';
import { isEmpty } from 'class-validator';
import { NotEnoughCreditException } from 'src/infrastructure/exceptions/not-enough-credit.exception';
import { InvalidUseRequestPerDayException } from 'src/infrastructure/exceptions/invalid-use-request-per-day.exception';
import { InvalidServiceInstanceIdException } from 'src/infrastructure/exceptions/invalid-service-instance-id.exception';
import {
  addMonths,
  dayDiff,
  monthDiff,
} from 'src/infrastructure/helpers/date-time.helper';
import { InvalidAradAIConfigException } from 'src/infrastructure/exceptions/invalid-arad-ai-config.exception';
import { UserTableService } from '../base/crud/user-table/user-table.service';
import { ConfigsTableService } from '../base/crud/configs-table/configs-table.service';
import { SettingTableService } from '../base/crud/setting-table/setting-table.service';
import { AITransactionsLogsTableService } from '../base/crud/aitransactions-logs-table/aitransactions-logs-table.service';
import { ServiceInstancesTableService } from '../base/crud/service-instances-table/service-instances-table.service';
import { ServicePropertiesTableService } from '../base/crud/service-properties-table/service-properties-table.service';
import { ServiceInstancesStoredProcedureService } from '../base/crud/service-instances-table/service-instances-stored-procedure.service';
import { Between, ILike } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { toInteger } from 'lodash';
import { GetAradAiDashoardDto } from './dto/get-arad-ai-dashoard.dto';

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
    private readonly jwtService: JwtService,
  ) {}

  async verifyToken(token: string): Promise<object> {
    const JWT_SECRET_KEY = process.env.ARAD_AI_JWT_SECRET_KEY;
    //console.log(token, JWT_SECRET_KEY);
    //console.log(this.jwtService.verify(token, { secret: JWT_SECRET_KEY }));
    return this.jwtService.verify(token, { secret: JWT_SECRET_KEY });
  }

  async checkAIToken(token: string): Promise<boolean> {
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

    const userId = verified['userId'];
    const user = await this.userTable.findById(userId);

    const expireDate = new Date(verified['expireDate']);
    const currentDate = new Date();
    if (expireDate < currentDate) {
      throw new InvalidTokenException();
    }

    const serviceProperties = await this.servicePropertiesTable.findOne({
      where: {
        propertyKey: ILike(`%aradAi%`),
        value: ILike(`%${token}%`),
      },
    });

    if (isEmpty(serviceProperties)) {
      throw new InvalidTokenException();
    }

    const serviceInstance = await this.serviceInstancesTable.findOne({
      where: {
        id: serviceProperties.serviceInstanceId,
      },
    });
    //console.log(serviceInstance);
    //console.log(verified,serviceInstance);
    if (
      isEmpty(verified['costPerRequest']) ||
      isEmpty(verified['createdDate']) ||
      (verified['qualityPlanCode'] != 'aiDemo' &&
        (serviceInstance.isDisabled || serviceInstance.isDeleted))
    ) {
      throw new InvalidTokenException();
    }
    const constPerRequest = parseInt(verified['costPerRequest']);

    if (constPerRequest > user.credit) {
      throw new NotEnoughCreditException();
    }
    if (verified['qualityPlanCode'] == 'aiDemo') {
      // Muximum use per day
      const usePerDay = await this.usedPerDay(
        serviceProperties.serviceInstanceId,
      );

      const maxRequestPerDay = await this.configsTable.findOne({
        where: {
          propertyKey: ILike(`%QualityPlans.demo.maxRequestPerDay%`),
        },
      });
      if (toInteger(maxRequestPerDay.value) < usePerDay) {
        throw new InvalidUseRequestPerDayException();
      }
    }
    return true;
  }

  async usedPerDay(serviceInstanceId: string): Promise<number> {
    const todayDate = new Date().toISOString().slice(0, 10);
    return await this.aiTransactionLogsTable.count({
      where: {
        serviceInstanceId: serviceInstanceId,
        dateTime: Between(
          new Date(`${todayDate}T00:00:00`),
          new Date(`${todayDate}T23:11:59`),
        ),
      },
    });
  }

  async usedPerMonth(
    serviceInstanceId: string,
    createdDate: Date,
  ): Promise<number> {
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
        serviceInstanceId: serviceInstanceId,
        dateTime: Between(
          new Date(`${fromDay}T00:00:00`),
          new Date(`${endDay}T23:11:59`),
        ),
      },
    });
  }

  async allRequestused(serviceInstanceID: string): Promise<number> {
    return await this.aiTransactionLogsTable.count({
      where: {
        serviceInstanceId: serviceInstanceID,
      },
    });
  }

  async createDemoToken(userId: number, token: string): Promise<any> {
    return await this.settingTable.create({
      userId: userId,
      key: 'aradAi.tokenDemo',
      value: token,
      insertTime: new Date(),
      updateTime: new Date(),
    });
  }

  async getAradAIDashboard(
    userId: number,
    serviceInstanceId: string,
  ): Promise<GetAradAiDashoardDto> {
    const serviceProperties = await this.servicePropertiesTable.findOne({
      where: { serviceInstanceId: serviceInstanceId },
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
      await this.serviceInstancesSP.spCountAradAiUsedEachService(
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

  async getAiServiceInfo(
    userId: number,
    serviceId: string,
    qualityPlanCode: string,
    duration: number,
  ): Promise<object> {
    const aiServiceConfigs = await this.configsTable.find({
      where: {
        propertyKey: ILike(`%${qualityPlanCode}%`),
        serviceTypeId: serviceId,
      },
    });

    const serviceAiInfo = {
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
      serviceAiInfo[key] = item;
    });
    return serviceAiInfo;
  }
}
