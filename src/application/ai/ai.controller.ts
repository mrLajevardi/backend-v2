import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { CreateAITransactionsLogsDto } from '../base/crud/aitransactions-logs-table/dto/create-aitransactions-logs.dto';
import { isEmpty } from 'lodash';
import { InvalidServiceInstanceIdException } from 'src/infrastructure/exceptions/invalid-service-instance-id.exception';
import { InvalidItemTypesException } from 'src/infrastructure/exceptions/invalid-item-types.exception';
import { InvalidTokenException } from 'src/infrastructure/exceptions/invalid-token.exception';
import { CreateServiceService } from '../base/service/services/create-service.service';
import aradAIConfig from 'src/infrastructure/config/aradAIConfig';
import jwt from 'jsonwebtoken';
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
import { LoggerService } from 'src/infrastructure/logger/logger.service';

@Controller('ai')
@ApiBearerAuth() // Requires authentication with a JWT token
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
    private readonly createServiceSvc: CreateServiceService,
    private readonly payAsYouGoService: PayAsYouGoService,
    private readonly configsTable: ConfigsTableService,
    private readonly loggerService: LoggerService,
  ) {}

  @ApiOperation({ summary: 'Check a Validation Token' })
  @Get('CheckToken')
  async checkAradAiToken(
    @Param('token') token: string,
    @Query() options: object,
  ): Promise<CheckTokenDto> {
    const result = await this.service.checkAIToken(token);
    return { tokenValidity: result };
  }

  @Post('/aiTransactionsLogs')
  //IMPORTANT
  // In main source code the Token was part of data
  // But now it is part of options, Or may be something else
  async createAITransactionsLogs(
    @Body() data: CreateAITransactionsLogsDto,
    @Request() options: any,
  ) {
    const serviceProperties = await this.servicePropertiesTable.findOne({
      where: {
        and: [{ Value: options.token }, { PropertyKey: { like: '%aradAi%' } }],
      },
    });

    if (isEmpty(serviceProperties)) {
      const err = new InvalidServiceInstanceIdException();
      return Promise.reject(err);
    }

    const itemTypes = await this.itemTypesTable.findOne({
      where: { Code: data.methodName },
    });

    if (isEmpty(itemTypes)) {
      const err = new InvalidItemTypesException();
      return Promise.reject(err);
    }
    const verified = await this.service.verifyToken(options.token);
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
      serviceInstance: serviceProperties.serviceInstance,
      description: data.methodName,
      request: data.request,
      body: data.body,
      response: data.response,
      ip: data.ip,
      methodName: data.methodName,
      method: data.method,
      codeStatus: data.codeStatus,
    });
  }

  @Post('/aradAi')
  async createAradAi(@Body() data: any, @Request() options: any) {
    const createdService = await this.createServiceSvc.createBillingService(
      data,
      options,
      'aradAi',
    );

    throw new InternalServerErrorException('Not Implemented');
    await this.loggerService.info(
        'aradAI',
        'createService',
        {
          _object: createdService.serviceInstanceId,
        },
        {...options.locals},
    );
  }

  @Get('/createOrGetDemoToken')
  async createOrGetDemoToken(@Request() options: any) {
    const userId = options.accessToken.userId;
    const getDemoToken = await this.settingsTable.findOne({
      where: {
        and: [{ UserId: userId }, { Key: 'AradAi.tokenDemo' }],
      },
    });

    if (isEmpty(getDemoToken)) {
      const ServiceAiInfo = await this.service.getAiServiceInfo(
        userId,
        'AradAi',
        'demo',
        12,
      );
      const token = jwt.sign(ServiceAiInfo, aradAIConfig.JWT_SECRET_KEY);

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
      return Promise.resolve(token);
    }
    return Promise.resolve(getDemoToken.value);
  }

  @Get('/aradAiDashoard/:serviceInstanceId')
  async getAradAiaDshboard(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options: any,
  ) {
    return await this.service.getAradAIDashboard(
      options.userId,
      serviceInstanceId,
    );
  }

  @Get('/aiTransactionsLogs/:serviceInstanceId')
  async getAITransactionsLogs(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Query('filter') filter: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Request() options: any,
  ) {
    let parsedFilter = {};
    let skip = 0;
    let limit = 10;

    if (!isEmpty(filter)) {
      parsedFilter = JSON.parse(filter).where;
    }

    if (!isEmpty(page)) {
      skip = pageSize * (page - 1);
    }

    if (!isEmpty(pageSize)) {
      limit = pageSize;
    }

    // TODO service should be just to current user
    const aiTransactionsLogs = await this.aiTransactionLogsTable.find({
      relations: ['ItemTypes'],
      where: {
        serviceInstanceId,
        ...parsedFilter,
      },
      take: limit,
      skip,
    });
    const countAll = await this.aiTransactionLogsTable.count({
      where: {
        ServiceInstanceID: serviceInstanceId,
        ...parsedFilter,
      },
    });

    return Promise.resolve({
      aiTransactionsLogs: aiTransactionsLogs,
      countAll,
    });
  }

  @Get('/aradAiType')
  async getAradAiType(
    @Query('filter') filter: string,
    @Request() options: any,
  ) {
    let parsedFilter = {};
    if (!isEmpty(filter)) {
      parsedFilter = JSON.parse(filter).where;
    }
    const items = await this.itemTypesTable.find({
      where: {
        and: [
          { ServiceTypeID: 'aradAi' },
          { Code: { nlike: '%ARADAIItem%' } },
          parsedFilter,
        ],
      },
    });

    const aradAiItem = await this.itemTypesTable.findOne({
      where: {
        and: [{ Code: 'ARADAIItem' }],
      },
    });

    const baseAddress = await this.configsTable.find({
      where: {
        PropertyKey: { like: '%config.aradai.baseAddress%' },
      },
    });

    const aradAiItems = items.map((item) => {
      return {
        ID: item.id,
        ServiceTypeID: item.serviceType.id,
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
        and: [
          { ServiceTypeID: 'aradAi' },
          { Code: { like: '%ai%' } },
          { Code: { nlike: '%Demo%' } },
        ],
      },
    });
    const costs = [];
    const fee = aradAiItem.fee;
    plans.forEach((element) => {
      costs.push({
        name: element.code + 'CostPerRequest',
        Value: fee + fee * element.additionRatio,
      });
      costs.push({
        name: element.code + 'CostPerMonth',
        Value: element.additionAmount,
      });
    });
    return Promise.resolve({ aradAiItems, costs });
  }

  @Get('/aradAiDashoardChart/:serviceInstanceId/:startDate/:endDate')
  async getDashboardChart(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
    @Request() options: any,
  ) {
    const result = await this.aiTransactionLogsSP.getChartAIUsed(
      startDate,
      endDate,
      serviceInstanceId,
    );
    return result;
  }

  @Get('/aiPlans')
  async getAiPlans(@Request() options: any, @Query('filter') filter: string) {
    let parsedFilter;
    if (!isEmpty(filter)) {
      parsedFilter = JSON.parse(filter);
    }

    const aradAiItem = await this.itemTypesTable.findOne({
      where: {
        and: [{ Code: 'ARADAIItem' }],
      },
    });
    const fee = aradAiItem.fee;

    const baseAddress = await this.configsTable.find({
      where: {
        PropertyKey: { like: '%config.aradai.baseAddress%' },
      },
    });

    const items = await this.itemTypesTable.find({
      where: {
        and: [{ ServiceTypeID: 'aradAi' }, { Code: { nlike: '%ARADAIItem%' } }],
      },
    });

    const aradAiItems = items.map((item) => {
      return {
        ID: item.id,
        ServiceTypeID: item.serviceType.id,
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
        and: [
          { ServiceTypeID: 'aradAi' },
          { Code: { like: '%ai%' } },
          { Code: { nlike: '%Demo%' } },
          parsedFilter,
        ],
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
