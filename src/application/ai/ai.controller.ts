import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { CreateAITransactionsLogsDto } from '../base/crud/aitransactions-logs-table/dto/create-aitransactions-logs.dto';
import { isEmpty } from 'lodash';
import { InvalidServiceInstanceIdException } from 'src/infrastructure/exceptions/invalid-service-instance-id.exception';
import { InvalidItemTypesException } from 'src/infrastructure/exceptions/invalid-item-types.exception';
import { InvalidTokenException } from 'src/infrastructure/exceptions/invalid-token.exception';
import { ExtendServiceService } from '../base/service/services/extend-service.service';
import aradAIConfig from 'src/infrastructure/config/aradAIConfig';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AITransactionsLogsTableService } from '../base/crud/aitransactions-logs-table/aitransactions-logs-table.service';
import { SettingTableService } from '../base/crud/setting-table/setting-table.service';
import { PlansTableService } from '../base/crud/plans-table/plans-table.service';
import { ServicePropertiesTableService } from '../base/crud/service-properties-table/service-properties-table.service';
import { ItemTypesTableService } from '../base/crud/item-types-table/item-types-table.service';
import { ServiceInstancesTableService } from '../base/crud/service-instances-table/service-instances-table.service';
import { PayAsYouGoService } from '../base/service/services/pay-as-you-go.service';
import { ConfigsTableService } from '../base/crud/configs-table/configs-table.service';
import { AitransactionsLogsStoredProcedureService } from '../base/crud/aitransactions-logs-table/aitransactions-logs-stored-procedure.service';
import { ILike, Not } from 'typeorm';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { Public } from './../../application/base/security/auth/decorators/ispublic.decorator';

@ApiBearerAuth() // Requires authentication with a JWT token
@Controller('ai')
@Injectable()
export class AiController {
  constructor(
    private readonly service: AiService,
    private readonly aiTransactionLogsTable: AITransactionsLogsTableService,
    private readonly aiTransactionLogsSP: AitransactionsLogsStoredProcedureService,
    private readonly settingsTable: SettingTableService,
    private readonly plansTable: PlansTableService,
    private readonly servicePropertiesTable: ServicePropertiesTableService,
    private readonly itemTypesTable: ItemTypesTableService,
    private readonly serviceInstancesTable: ServiceInstancesTableService,
    private readonly createServiceSvc: ExtendServiceService,
    private readonly payAsYouGoService: PayAsYouGoService,
    private readonly configsTable: ConfigsTableService,
    private readonly jwtService: JwtService,
    private readonly loggerService: LoggerService,
  ) {}
  async sign(payload: object): Promise<string> {
    const JWT_SECRET_KEY = aradAIConfig.JWT_SECRET_KEY;
    return this.jwtService.sign(payload, { secret: JWT_SECRET_KEY });
  }
  @Get('CheckToken/:token')
  @Public()
  async checkAradAiToken(
    @Param('token') token: string,
    // @Query() options: object,
  ): Promise<CheckTokenDto> {
    const result = await this.service.checkAIToken(token);
    return { tokenValidity: result };
  }

  @Post('/aiTransactionsLogs')
  @Public()
  async createAITransactionsLogs(@Body() data: CreateAITransactionsLogsDto) {
    const serviceProperties = await this.servicePropertiesTable.findOne({
      where: {
        value: ILike(`%${data.token}%`),
        propertyKey: ILike(`%aradAi%`),
      },
    });

    if (isEmpty(serviceProperties)) {
      const err = new InvalidServiceInstanceIdException();
      return Promise.reject(err);
    }

    const itemTypes = await this.itemTypesTable.findOne({
      where: { code: data.description },
    });

    if (isEmpty(itemTypes)) {
      const err = new InvalidItemTypesException();
      return Promise.reject(err);
    }
    const verified = await this.service.verifyToken(data.token);
    if (!verified) {
      throw new InvalidTokenException();
    }

    const constPerRequest = parseInt(verified['costPerRequest']);
    this.payAsYouGoService.payAsYouGoService(
      serviceProperties.serviceInstanceId,
      constPerRequest,
    );

    const itemType = await this.itemTypesTable.findById(itemTypes.id);
    return await this.aiTransactionLogsTable.create({
      dateTime: new Date(),
      itemType: itemType,
      serviceInstanceId: serviceProperties.serviceInstanceId,
      description: data.methodName,
      request: data.request,
      body: data.body,
      response: data.response,
      ip: data.ip,
      methodName: data.methodName,
      method: data.method,
      codeStatus: data.codeStatus,
      token: data.token,
    });
  }

  @Get('/createOrGetDemoToken')
  async createOrGetDemoToken(
    @Request() options: any,
  ): Promise<GetDemoTokenDto> {
    const userId = options.user.userId;
    const getDemoToken = await this.settingsTable.findOne({
      where: {
        userId: userId,
        key: 'AradAi.tokenDemo',
      },
    });

    if (isEmpty(getDemoToken)) {
      const serviceAiInfo = await this.service.getAiServiceInfo(
        userId,
        'aradAi',
        'demo',
        12,
      );
      const token = await this.sign(serviceAiInfo);
      await this.service.createDemoToken(userId, token);
      const serviceID = await this.createServiceSvc.createServiceInstance(
        userId,
        'aradAiDemo',
        12,
      );
      await this.servicePropertiesTable.create({
        serviceInstanceId: serviceID,
        propertyKey: 'aradAiDemo.token',
        value: token,
      });
      return Promise.resolve({
        demoToken: token,
      });
    }
    return Promise.resolve({
      demoToken: getDemoToken.value,
    });
  }

  @Get('/aradAiDashoard/:serviceInstanceId')
  async getAradAiaDshboard(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options: any,
  ): Promise<GetAradAiDashoardDto> {
    return await this.service.getAradAIDashboard(
      options.user.id,
      serviceInstanceId,
    );
  }

  @Get('/aiTransactionsLogs/:serviceInstanceId')
  async getAITransactionsLogs(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    // @Request() options: any,
  ): Promise<GetAiTransactionsLogsDto> {
    let skip = 0;
    let limit = 10;

    if (!isEmpty(page) && !isEmpty(pageSize)) {
      skip = pageSize * (page - 1);
    }

    if (!isEmpty(pageSize)) {
      limit = pageSize;
    }

    // TODO service should be just to current user
    const aiTransactionsLogs = await this.aiTransactionLogsTable.find({
      where: {
        serviceInstanceId: serviceInstanceId,
      },
      take: limit,
      skip,
    });
    const countAll = await this.aiTransactionLogsTable.count({
      where: {
        serviceInstanceId: serviceInstanceId,
      },
    });

    return Promise.resolve({
      aiTransactionsLogs: aiTransactionsLogs,
      countAll,
    });
  }

  @Get('/aradAiDashoardChart/:serviceInstanceId/:startDate/:endDate')
  async getDashboardChart(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
    // @Request() options: any,
  ): Promise<GetAradAiDashoardChartDto> {
    const result = await this.aiTransactionLogsSP.getChartAIUsed(
      startDate,
      endDate,
      serviceInstanceId,
    );
    return result;
  }

  @Get('/aiPlans')
  async getAiPlans(): Promise<GetPlanItemsDto[]> {
    const aradAiItem = await this.itemTypesTable.findOne({
      where: {
        code: 'ARADAIItem',
      },
    });
    const fee = aradAiItem.fee;

    const baseAddress = await this.configsTable.find({
      where: {
        propertyKey: ILike(`%config.aradai.baseAddress%`),
      },
    });

    const items = await this.itemTypesTable.find({
      where: {
        serviceTypeId: 'aradAi',
        code: Not(ILike(`%ARADAIItem%`)),
      },
    });

    const aradAiItems = items.map((item) => {
      return {
        ID: item.id,
        ServiceTypeID: item.serviceTypeId,
        Title: item.title,
        Unit: item.unit,
        Fee: item.fee,
        Code: item.code,
        MaxAvailable: item.maxAvailable,
        MaxPerRequest: item.maxPerRequest,
        MinPerRequest: item.minPerRequest,
        AddressDemo: baseAddress[0].value.replace('?', item.id.toString()),
      };
    });

    const plans = await this.plansTable.find({
      where: {
        code: ILike(`%ai%`) && Not(ILike('%Demo%')),
        condition: ILike(`%aradAi%`),
      },
    });
    const planItems = plans.map((element) => {
      return {
        Code: element.code,
        AdditionRatio: element.additionRatio,
        Description: element.description,
        Condition: element.condition,
        AdditionAmount: element.additionAmount,
        CostPerRequest: fee + fee * element.additionRatio,
        Items: aradAiItems,
      };
    });
    return Promise.resolve(planItems);
  }
}
