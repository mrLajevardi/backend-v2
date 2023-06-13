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
import { CreateAiTransactionsLogsDto } from '../base/ai-transactions-logs/dto/create-ai-transactions-logs.dto';
import { ServicePropertiesService } from '../base/service-properties/service-properties.service';
import { isEmpty } from 'lodash';
import { InvalidServiceInstanceIdException } from 'src/infrastructure/exceptions/invalid-service-instance-id.exception';
import { ItemTypesService } from '../base/item-types/item-types.service';
import { InvalidItemTypesException } from 'src/infrastructure/exceptions/invalid-item-types.exception';
import { InvalidTokenException } from 'src/infrastructure/exceptions/invalid-token.exception';
import { AiTransactionsLogsService } from '../base/ai-transactions-logs/ai-transactions-logs.service';
import { CreateServiceService } from '../base/service-instances/create-service.service';
import { ServiceInstancesService } from '../base/service-instances/service-instances.service';
import { CreateServicePropertiesDto } from '../base/service-properties/dto/create-service-properties.dto';
import { SettingService } from '../base/setting/setting.service';
import aradAIConfig from 'src/infrastructure/config/aradAIConfig';
import jwt from 'jsonwebtoken';
import { ConfigsService } from '../base/configs/configs.service';
import { PlansService } from '../base/plans/plans.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('ai')
@ApiBearerAuth() // Requires authentication with a JWT token
export class AiController {
  constructor(
    private readonly service: AiService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly itemTypesService: ItemTypesService,
    private readonly aiTransactionLogsService: AiTransactionsLogsService,
    private readonly createServiceSvc: CreateServiceService,
    private readonly settingsService: SettingService,
    private readonly configsService: ConfigsService,
    private readonly plansService: PlansService,
    private readonly serviceInstancesService: ServiceInstancesService,
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
    @Body() data: CreateAiTransactionsLogsDto,
    @Request() options: any,
  ) {
    const serviceProperties = await this.servicePropertiesService.findOne({
      where: {
        and: [{ Value: options.token }, { PropertyKey: { like: '%aradAi%' } }],
      },
    });

    if (isEmpty(serviceProperties)) {
      const err = new InvalidServiceInstanceIdException();
      return Promise.reject(err);
    }

    const itemTypes = await this.itemTypesService.findOne({
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
    this.serviceInstancesService.payAsYouGoService(
      serviceProperties.serviceInstanceId,
      constPerRequest,
    );

    const itemType = await this.itemTypesService.findById(itemTypes.id);
    return await this.aiTransactionLogsService.create({
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
    // await logger.info(
    //     'aradAI',
    //     'createService',
    //     {
    //       _object: createdService.serviceInstanceId,
    //     },
    //     {...options.locals},
    // );
  }

  @Get('/createOrGetDemoToken')
  async createOrGetDemoToken(@Request() options: any) {
    const userId = options.accessToken.userId;
    const getDemoToken = await this.settingsService.findOne({
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
      await this.servicePropertiesService.create({
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
    const aiTransactionsLogs = await this.aiTransactionLogsService.find({
      relations: ['ItemTypes'],
      where: {
        serviceInstanceId,
        ...parsedFilter,
      },
      take: limit,
      skip,
    });
    const countAll = await this.aiTransactionLogsService.count({
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
    const items = await this.itemTypesService.find({
      where: {
        and: [
          { ServiceTypeID: 'aradAi' },
          { Code: { nlike: '%ARADAIItem%' } },
          parsedFilter,
        ],
      },
    });

    const aradAiItem = await this.itemTypesService.findOne({
      where: {
        and: [{ Code: 'ARADAIItem' }],
      },
    });

    const baseAddress = await this.configsService.find({
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
    const plans = await this.plansService.find({
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
    const result = await this.aiTransactionLogsService.getChartAIUsed(
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

    const aradAiItem = await this.itemTypesService.findOne({
      where: {
        and: [{ Code: 'ARADAIItem' }],
      },
    });
    const fee = aradAiItem.fee;

    const baseAddress = await this.configsService.find({
      where: {
        PropertyKey: { like: '%config.aradai.baseAddress%' },
      },
    });

    const items = await this.itemTypesService.find({
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

    const plans = await this.plansService.find({
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
