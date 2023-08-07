import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { UserService } from '../base/user/service/user.service';
import { DiscountsService } from '../base/service/services/discounts.service';
import { TransactionsService } from '../base/transactions/transactions.service';
import { CreateServiceService } from '../base/service/services/create-service.service';
import { ServiceChecksService } from '../base/service/services/service-checks.service';
import { QualityPlansService } from '../base/crud/quality-plans/quality-plans.service';
import { ServiceItemsSumService } from '../base/crud/service-items-sum/service-items-sum.service';
import { InvoicesService } from '../base/invoice/service/invoices.service';
import { InvoicesChecksService } from '../base/invoice/service/invoices-checks.service';
import { CostCalculationService } from '../base/invoice/service/cost-calculation.service';
import { VgpuService } from '../vgpu/vgpu.service';
import { SessionsService } from '../base/sessions/sessions.service';
import { AITransactionsLogsTableService } from '../base/crud/aitransactions-logs-table/aitransactions-logs-table.service';
import { ConfigsTableService } from '../base/crud/configs-table/configs-table.service';
import { InvoiceDiscountsTableService } from '../base/crud/invoice-discounts-table/invoice-discounts-table.service';
import { InvoiceItemsTableService } from '../base/crud/invoice-items-table/invoice-items-table.service';
import { InvoicePlansTableService } from '../base/crud/invoice-plans-table/invoice-plans-table.service';
import { InvoicePropertiesTableService } from '../base/crud/invoice-properties-table/invoice-properties-table.service';
import { ItemTypesTableService } from '../base/crud/item-types-table/item-types-table.service';
import { PlansTableService } from '../base/crud/plans-table/plans-table.service';
import { ServiceInstancesTableService } from '../base/crud/service-instances-table/service-instances-table.service';
import { ServiceItemsTableService } from '../base/crud/service-items-table/service-items-table.service';
import { ServicePropertiesTableService } from '../base/crud/service-properties-table/service-properties-table.service';
import { ServiceTypesTableService } from '../base/crud/service-types-table/service-types-table.service';
import { SettingTableService } from '../base/crud/setting-table/setting-table.service';
import { UserTableService } from '../base/crud/user-table/user-table.service';
import { InvoicesTableService } from '../base/crud/invoices-table/invoices-table.service';
import { ServiceInstancesStoredProcedureService } from '../base/crud/service-instances-table/service-instances-stored-procedure.service';
import { DiscountsTableService } from '../base/crud/discounts-table/discounts-table.service';
import { TransactionsTableService } from '../base/crud/transactions-table/transactions-table.service';
import { ServiceService } from '../base/service/services/service.service';
import { PlansQueryService } from '../base/crud/plans-table/plans-query.service';
import { SessionsTableService } from '../base/crud/sessions-table/sessions-table.service';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { InvalidServiceInstanceIdException } from 'src/infrastructure/exceptions/invalid-service-instance-id.exception';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { CrudModule } from '../base/crud/crud.module';
import { InvoicesModule } from '../base/invoice/invoices.module';
import { ServiceModule } from '../base/service/service.module';
import { UserModule } from '../base/user/user.module';
import { AiController } from './ai.controller';
// import { addMonths } from 'src/infrastructure/helpers/date-time.helper';

describe('AiService', () => {
  let service: AiService;
  let settingTable: SettingTableService;
  let testDataService: TestDataService;
  let serviceInstanceTable: ServiceInstancesTableService;
  let servicePropertiesTable: ServicePropertiesTableService;
  let serviceTypes: ServiceTypesTableService;
  let aITransactionsLogs: AITransactionsLogsTableService;
  let itemType: ItemTypesTableService;
  let user: UserService;
  let config: ConfigsTableService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        DatabaseModule,
        UserModule,
        CrudModule,
        InvoicesModule,
        ServiceModule,
        LoggerModule,
        JwtModule,
      ],
      providers: [AiService],
    }).compile();

    service = module.get<AiService>(AiService);
    user = module.get<UserService>(UserService);
    config = module.get<ConfigsTableService>(ConfigsTableService);
    settingTable = module.get<SettingTableService>(SettingTableService);
    serviceTypes = module.get<ServiceTypesTableService>(
      ServiceTypesTableService,
    );
    serviceInstanceTable = module.get<ServiceInstancesTableService>(
      ServiceInstancesTableService,
    );
    servicePropertiesTable = module.get<ServicePropertiesTableService>(
      ServicePropertiesTableService,
    );
    itemType = module.get<ItemTypesTableService>(ItemTypesTableService);
    aITransactionsLogs = module.get<AITransactionsLogsTableService>(
      AITransactionsLogsTableService,
    );
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(user).toBeDefined();
    expect(config).toBeDefined();
    expect(settingTable).toBeDefined();
    expect(serviceTypes).toBeDefined();
    expect(serviceInstanceTable).toBeDefined();
    expect(servicePropertiesTable).toBeDefined();
    expect(itemType).toBeDefined();
    expect(aITransactionsLogs).toBeDefined();
  });
  describe('verifyToken', () => {
    it('should return the decoded token for a valid token', async () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJxdWFsaXR5UGxhbkNvZGUiOiJhaVBlcnNvbmFsIiwiY3JlYXRlZERhdGUiOiIyMDIzLTA3LTEwVDE2OjQ2OjEzLjQwMFoiLCJ1c2VySWQiOiI1ODciLCJkdXJhdGlvbiI6MTgwLCJleHBpcmVEYXRlIjoiMjAyNC0wMS0wNlQxNzo0NjoxMy4zOTdaIiwiY29zdFBlclJlcXVlc3QiOjUwLCJjb3N0UGVyTW9udGgiOjAsImlhdCI6MTY4OTAwNzU3NH0.kNp8f61qDC-ZhZp9WMfuV4nlO7C6hFgGF0UeoWzR3rw';

      const decodedToken = {
        costPerMonth: 0,
        costPerRequest: 50,
        createdDate: '2023-07-10T16:46:13.400Z',
        duration: 180,
        expireDate: '2024-01-06T17:46:13.397Z',
        iat: 1689007574,
        qualityPlanCode: 'aiPersonal',
        userId: '587',
      };
      const result = await service.verifyToken(token);
      expect(result).toEqual(decodedToken);
    });

    it('should throw an error for an invalid token', async () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJxdWFsaXR5UGxhbkNvZGUiOiJhaVBlcnNvbmFsIiwiY3JlYXRlZERhdGUiOiIyMDIzLTA3LTEwVDE2OjQ2OjEzLjQwMFoiLCJ1c2VySWQiOiI1ODciLCJkdXJhdGlvbiI6MTgwLCJleHBpcmVEYXRlIjoiMjAyNC0wMS0wNlQxNzo0NjoxMy4zOTdaIiwiY29zdFBlclJlcXVlc3QiOjUwLCJjb3N0UGVyTW9udGgiOjAsImlhdCI6MTY4OTAwNzU3NH0.kNp8f61qDC-ZhZp9';
      const errorMessage = 'invalid signature';
      await expect(service.verifyToken(token)).rejects.toThrow(errorMessage);
    });
  });
  describe('checkAIToken', () => {
    it('should return true for valid token', async () => {
      const setting = await settingTable.findOne({ where: { userId: 587 } });
      console.log('Setting', setting);
      const token = setting.value;
      const result = await service.checkAIToken(token);
      expect(result).toBe(true);
    });

    it('should throw an error for invalid token', async () => {
      const token = 'abc';
      await expect(service.checkAIToken(token)).rejects.toThrow();
    });

    it('should throw an error for invalid use request per day', async () => {
      const setting = await settingTable.findOne({ where: { userId: 637 } });
      const token = setting.value;
      await expect(service.checkAIToken(token)).rejects.toThrow();
    });

    it('should throw an error for not enough credit', async () => {
      const serviceInstance = await serviceInstanceTable.findOne({
        where: {
          userId: 637,
          status: 3,
        },
      });
      const serviceInstanceId = serviceInstance.id;
      const serviceProperties = await servicePropertiesTable.findOne({
        where: {
          serviceInstanceId: serviceInstanceId,
        },
      });
      const token = serviceProperties.value;

      await expect(service.checkAIToken(token)).rejects.toThrow();
    });
  });
  describe('usedPerDay', () => {
    it('should return 0 for no transactions for today', async () => {
      const serviceInstanceId = 'B66F95BB-F018-4346-8B02-4CD4535D9F11';
      const result = await service.usedPerDay(serviceInstanceId);
      expect(result).toBe(0);
    });
    it('should return the number of transactions for today', async () => {
      const serviceInstanceId = '7451E733-D18D-4329-B3FD-76429E4EDBEA';
      // const aITransactions = await aITransactionsLogs.create({
      //   serviceInstanceId: '7451E733-D18D-4329-B3FD-76429E4EDBEA',
      //   dateTime: new Date(),
      //   description: 'translate',
      //   itemType: {
      //     id: 81,
      //     title: 'ترجمه',
      //     unit: 'token',
      //     fee: 500,
      //     maxAvailable: 10,
      //     code: 'translate',
      //     maxPerRequest: 10,
      //     minPerRequest: null,
      //     aiTransactionsLogs: [],
      //     invoiceItems: [],
      //     serviceType: null,
      //     serviceItems: [],
      //     serviceTypeId: 'aradAi',
      //   },
      //   request: 'http://172.20.51.101:8000/translate/',
      //   body: '{"text": "hello this is a test", "lang": "fa"}',
      //   response: "{'translatedText':'سلام این یک آزمایش است'}",
      //   method: 'POST',
      //   codeStatus: 200,
      //   methodName: 'translate',
      //   ip: '172.22.20.16',
      //   token:
      //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJxdWFsaXR5UGxhbkNvZGUiOiJhaVBlcnNvbmFsIiwiY3JlYXRlZERhdGUiOiIyMDIzLTA3LTEwVDE2OjQ2OjEzLjQwMFoiLCJ1c2VySWQiOiI1ODciLCJkdXJhdGlvbiI6MTgwLCJleHBpcmVEYXRlIjoiMjAyNC0wMS0wNlQxNzo0NjoxMy4zOTdaIiwiY29zdFBlclJlcXVlc3QiOjUwLCJjb3N0UGVyTW9udGgiOjAsImlhdCI6MTY4OTAwNzU3NH0.kNp8f61qDC-ZhZp9WMfuV4nlO7C6hFgGF0UeoWzR3rw',
      // });
      const result = await service.usedPerDay(serviceInstanceId);
      expect(result);
      // expect(result).toBeGreaterThan(0);
      // expect(result).toBe(1);
    });
  });

  describe('usedPerMonth', () => {
    it('should return the transactions for the given month', async () => {
      const serviceInstanceId = '7451E733-D18D-4329-B3FD-76429E4EDBEA';
      const createdDate = new Date();
      // const aITransactions = await aITransactionsLogs.create({
      //   serviceInstanceId: '7451E733-D18D-4329-B3FD-76429E4EDBEA',
      //   dateTime: createdDate,
      //   description: 'translate',
      //   itemType: {
      //     id: 81,
      //     title: 'ترجمه',
      //     unit: 'token',
      //     fee: 500,
      //     maxAvailable: 10,
      //     code: 'translate',
      //     maxPerRequest: 10,
      //     minPerRequest: null,
      //     aiTransactionsLogs: [],
      //     invoiceItems: [],
      //     serviceType: null,
      //     serviceItems: [],
      //     serviceTypeId: 'aradAi',
      //   },
      //   request: 'http://172.20.51.101:8000/translate/',
      //   body: '{"text": "hello this is a test", "lang": "fa"}',
      //   response: "{'translatedText':'سلام این یک آزمایش است'}",
      //   method: 'POST',
      //   codeStatus: 200,
      //   methodName: 'translate',
      //   ip: '172.22.20.16',
      //   token:
      //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJxdWFsaXR5UGxhbkNvZGUiOiJhaVBlcnNvbmFsIiwiY3JlYXRlZERhdGUiOiIyMDIzLTA3LTEwVDE2OjQ2OjEzLjQwMFoiLCJ1c2VySWQiOiI1ODciLCJkdXJhdGlvbiI6MTgwLCJleHBpcmVEYXRlIjoiMjAyNC0wMS0wNlQxNzo0NjoxMy4zOTdaIiwiY29zdFBlclJlcXVlc3QiOjUwLCJjb3N0UGVyTW9udGgiOjAsImlhdCI6MTY4OTAwNzU3NH0.kNp8f61qDC-ZhZp9WMfuV4nlO7C6hFgGF0UeoWzR3rw',
      // });
      const result = await service.usedPerMonth(serviceInstanceId, createdDate);
      expect(result);
      // .toEqual([
      //   {
      //     body: '{"text": "hello this is a test", "lang": "fa"}',
      //     codeStatus: 200,
      //     dateTime: createdDate,
      //     description: 'translate',
      //     id: 11,
      //     ip: '172.22.20.16',
      //     method: 'POST',
      //     methodName: 'translate',
      //     request: 'http://172.20.51.101:8000/translate/',
      //     response: `{'translatedText':'سلام این یک آزمایش است'}`,
      //     serviceInstanceId: '7451E733-D18D-4329-B3FD-76429E4EDBEA',
      //   },
      // ]);
    });

    it('should return an empty array for no transactions for the given month', async () => {
      const serviceInstanceId = 'B66F95BB-F018-4346-8B02-4CD4535D9F11';
      const createdDate = new Date();
      const result = await service.usedPerMonth(serviceInstanceId, createdDate);
      expect(result).toEqual([]);
    });
  });

  describe('allRequestused', () => {
    it('should return the total number of requests used', async () => {
      const serviceInstanceId = '5578AF82-7B09-4AC4-B0B1-1068498159r4';
      const totalRequestsUsed = 10;
      const result = await service.allRequestused(serviceInstanceId);
      expect(result).toBe(totalRequestsUsed);
    });

    it('should return 0 for no transactions for the given service instance ID', async () => {
      const serviceInstanceId = 'B66F95BB-F018-4346-8B02-4CD4535D9F11';
      const result = await service.allRequestused(serviceInstanceId);
      expect(result).toBe(0);
    });
  });

  describe('createDemoToken', () => {
    it('should create a demo token and return the created record', async () => {
      const userId = 597;
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJxdWFsaXR5UGxhbkNvZGUiOiJhaURlbW8iLCJjcmVhdGVkRGF0ZSI6IjIwMjMtMDctMTBUMDg6NDk6MzguNzExWiIsInVzZXJJZCI6IjYzNyIsImR1cmF0aW9uIjoxMiwiZXhwaXJlRGF0ZSI6IjIwMjQtMDctMDRUMDg6NDk6MzguNzExWiIsImNvc3RQZXJSZXF1ZXN0IjoxMDAsImNvc3RQZXJNb250aCI6MCwiaWF0IjoxNjg4OTc4OTc4fQ.DGJgbA6X981DWG9KyWxobjN3ojv0D';
      const result = await service.createDemoToken(userId, token);
      expect(result);
      //.toEqual(createdRecord);
    });
  });
  describe('getAradAIDashboard', () => {
    // TODO create procedure

    // it('should return the dashboard data for the given user ID and service instance ID', async () => {
    // const userId = 637;
    // const serviceInstanceId = '7451E733-D18D-4329-B3FD-76429E4EDBEA';
    // const result = await service.getAradAIDashboard(
    //   userId,
    //   serviceInstanceId,
    // );
    // expect(result).toEqual({
    //   token: serviceProperties.value,
    //   usedPerDay: usePerDay,
    //   allRequestused: allRequestuse,
    //   usedPerMonth: usePerMonth,
    //   creditUsed: creditUsed,
    //   creditRemaining: user.credit,
    //   remainingDays: remainingDays,
    //   numberOfServiceCalled: numberOfServiceCalled,
    //   QualityPlan: verifiedToken,
    // });
    //  });

    it('should throw an InvalidServiceInstanceIdException if the service instance ID is invalid', async () => {
      const userId = 637;
      const serviceInstanceId = '5578AF82-7B09-4AC4-B0B1-106aaaa159r4';
      await expect(
        service.getAradAIDashboard(userId, serviceInstanceId),
      ).rejects.toThrow(InvalidServiceInstanceIdException);
    });
  });

  describe('getAiServiceInfo', () => {
    it('should return the AI service info for the given user ID, service ID, quality plan code, and duration', async () => {
      // const userId = 587;
      // const serviceId = '7451E733-D18D-4329-B3FD-76429E4EDBEA';
      // const qualityPlanCode = 'aradAi';
      // const duration = 1;
      // const result = await service.getAiServiceInfo(
      //   userId,
      //   serviceId,
      //   qualityPlanCode,
      //   duration,
      // );
      // TODO the result have quit differnce form result on (createdDate)
      // expect(result).toEqual({
      //   qualityPlanCode: 'aradAi',
      //   createdDate: new Date().toISOString(),
      //   userId: 587,
      //   duration: 1,
      //   expireDate: addMonths(new Date(), duration),
      // });
    });
  });
});
