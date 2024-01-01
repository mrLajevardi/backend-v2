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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AITransactionsLogsTableService } from '../base/crud/aitransactions-logs-table/aitransactions-logs-table.service';
import { SettingTableService } from '../base/crud/setting-table/setting-table.service';
import { PlansTableService } from '../base/crud/plans-table/plans-table.service';
import { ServicePropertiesTableService } from '../base/crud/service-properties-table/service-properties-table.service';
import { ItemTypesTableService } from '../base/crud/item-types-table/item-types-table.service';
import { PayAsYouGoService } from '../base/pay-as-you-go/pay-as-you-go.service';
import { ConfigsTableService } from '../base/crud/configs-table/configs-table.service';
import { AitransactionsLogsStoredProcedureService } from '../base/crud/aitransactions-logs-table/aitransactions-logs-stored-procedure.service';
import { ILike, Not } from 'typeorm';
import { Public } from './../../application/base/security/auth/decorators/ispublic.decorator';
import { JwtService } from '@nestjs/jwt';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { CheckTokenDto } from './dto/check-token.dto';
import { GetDemoTokenDto } from './dto/get-demo-token.dto';
import { GetAradAiDashoardDto } from './dto/get-arad-ai-dashoard.dto';
import {
  AiTransactionLogDto,
  GetAiTransactionsLogsDto,
} from './dto/get-ai-transactions-logs.dto';
import { GetPlanItemsDto } from './dto/get-plan-items.dto';
import { GetAradAiDashoardChartDto } from './dto/get-arad-ai-dashoard-chart.dto';
import { AiTransactionsLogs } from 'src/infrastructure/database/entities/AiTransactionsLogs';
import { InvoiceDetailBaseDto } from '../vdc/dto/invoice-detail-base.dto';
import { CheckPolicies } from '../base/security/ability/decorators/check-policies.decorator';
import { PureAbility, subject } from '@casl/ability';
import { PolicyHandlerOptions } from '../base/security/ability/interfaces/policy-handler.interface';
import { AclSubjectsEnum } from '../base/security/ability/enum/acl-subjects.enum';
import { Action } from '../base/security/ability/enum/action.enum';

@ApiTags('AI')
@ApiBearerAuth() // Requires authentication with a JWT token
@Controller('ai')
// @CheckPolicies((ability: PureAbility, props: PolicyHandlerOptions) =>
//   ability.can(Action.Manage, subject(AclSubjectsEnum.Ai, props)),
// )
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
    private readonly payAsYouGoService: PayAsYouGoService,
    private readonly configsTable: ConfigsTableService,
    private readonly jwtService: JwtService,
  ) {}

  async sign(payload: object): Promise<string> {
    const JWT_SECRET_KEY = process.env.ARAD_AI_JWT_SECRET_KEY;
    return this.jwtService.sign(payload, { secret: JWT_SECRET_KEY });
  }

  @ApiOperation({ summary: 'Check AI Token' })
  @ApiResponse({
    status: 200,
    description: 'Returns a token Validity as boolean',
    type: 'object',
  })
  @Get('CheckToken/:token')
  @Public()
  async checkAradAiToken(
    @Param('token') token: string,
    // @Query() options: object,
  ): Promise<CheckTokenDto> {
    const result = await this.service.checkAIToken(token);
    return { tokenValidity: result };
  }

  @ApiOperation({ summary: 'create AI transactions logs' })
  @Post('/aiTransactionsLogs')
  @Public()
  async createAITransactionsLogs(
    @Body() data: CreateAITransactionsLogsDto,
  ): Promise<AiTransactionsLogs> {
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

    console.log(itemTypes.id);
    const itemType = await this.itemTypesTable.findById(itemTypes.id);
    const itemData = {
      dateTime: new Date(),
      itemTypeId: itemType.id,
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
    };
    return await this.aiTransactionLogsTable.create(itemData);
  }

  @ApiOperation({ summary: 'Get Ai demo token' })
  @ApiResponse({
    status: 200,
    description: 'Returns demo token',
    type: 'object',
  })
  @Get('/createOrGetDemoToken')
  async createOrGetDemoToken(
    @Request() options: SessionRequest,
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
      // const serviceID = await this.createServiceSvc.createServiceInstance(
      //   userId,
      //   'aradAiDemo',
      //   12,
      // );
      // await this.servicePropertiesTable.create({
      //   serviceInstanceId: serviceID,
      //   propertyKey: 'aradAiDemo.token',
      //   value: token,
      // });
      // return Promise.resolve({demoToken: token});
    }
    return Promise.resolve({
      demoToken: getDemoToken.value,
    });
  }

  @ApiOperation({ summary: 'Get AI Dashoard' })
  @ApiResponse({
    status: 200,
    description: 'Returns details of AI service',
    type: 'object',
  })
  @Get('/aradAiDashoard/:serviceInstanceId')
  async getAradAiDashboard(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Request() options: SessionRequest,
  ): Promise<GetAradAiDashoardDto> {
    return await this.service.getAradAIDashboard(
      options.user.userId,
      serviceInstanceId,
    );
  }

  @ApiOperation({ summary: 'Get AI transactions logs' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of transactions logs',
    type: 'array',
  })
  @Get('/aiTransactionsLogs/:serviceInstanceId')
  async getAITransactionsLogs(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    //@Request() options: SessionRequest,
  ): Promise<GetAiTransactionsLogsDto> {
    let skip = 0;
    let limit = 10;
    // const userId = options.user.userId;
    if (!isEmpty(page) && !isEmpty(pageSize)) {
      skip = pageSize * (page - 1);
    }

    if (!isEmpty(pageSize)) {
      limit = pageSize;
    }

    // TODO service should be just to current user
    const transactionsLogs = await this.aiTransactionLogsTable.find({
      where: {
        serviceInstanceId: serviceInstanceId,
      },
      take: limit,
      skip,
    });

    const aiTransactionsLogs = transactionsLogs.map((log) => {
      return {
        id: log.id,
        serviceInstanceId: log.serviceInstanceId,
        method: log.method,
        codeStatus: log.codeStatus,
        methodName: log.methodName,
        ip: log.ip,
        description: log.description,
        dateTime: log.dateTime,
        request: log.request,
        body: log.body,
        response: log.response,
      } as AiTransactionLogDto;
    });

    const countAll = await this.aiTransactionLogsTable.count({
      where: {
        serviceInstanceId: serviceInstanceId,
      },
    });

    return Promise.resolve({
      aiTransactionsLogs,
      countAll,
    });
  }

  @ApiOperation({ summary: 'Get AI dashoard chart' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of Useing service daily',
    type: 'array',
  })
  @Get('/aradAiDashoardChart/:serviceInstanceId/:startDate/:endDate')
  async getDashboardChart(
    @Param('serviceInstanceId') serviceInstanceId: string,
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
    // @Request() options: SessionRequest,
  ): Promise<GetAradAiDashoardChartDto> {
    const result = await this.aiTransactionLogsSP.getChartAIUsed(
      startDate,
      endDate,
      serviceInstanceId,
    );
    return result;
  }

  @ApiOperation({ summary: 'Get AI plans' })
  @ApiResponse({
    status: 200,
    description: 'Returns ai plans',
    type: 'array',
  })
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

  // @ApiOperation({ summary: 'Get AI plans' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns ai plans',
  //   type: 'array',
  // })
  @ApiParam({ name: 'invoiceId', description: 'ai invoiceId' })
  @Get('/Invoice/detail/:invoiceId')
  async getAiInvoiceDetail(
    @Param('invoiceId')
    invoiceId: string,
  ): Promise<InvoiceDetailBaseDto> {
    const res = await this.service.getAIInvoiceDetail(invoiceId);
    return res;
  }
}
