import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from './ai.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { AiService } from './ai.service';
import { UserService } from '../base/user/user.service';
import { DiscountsService } from '../base/service/services/discounts.service';
import { TransactionsService } from '../base/transactions/transactions.service';
import { CreateServiceService } from '../base/service/services/create-service.service';
import { ServiceChecksService } from '../base/service/services/service-checks/service-checks.service';
import { QualityPlansService } from '../base/crud/quality-plans/quality-plans.service';
import { InvoicesService } from '../base/invoice/service/invoices.service';
import { ServiceItemsSumService } from '../base/crud/service-items-sum/service-items-sum.service';
import { InvoicesChecksService } from '../base/invoice/service/invoices-checks.service';
import { CostCalculationService } from '../base/invoice/service/cost-calculation.service';
import { VgpuService } from '../vgpu/vgpu.service';
import { SessionsService } from '../base/sessions/sessions.service';
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
import { AITransactionsLogsTableService } from '../base/crud/aitransactions-logs-table/aitransactions-logs-table.service';
import { DiscountsTableService } from '../base/crud/discounts-table/discounts-table.service';
import { PlansQueryService } from '../base/crud/plans-table/plans-query.service';
import { ServiceInstancesStoredProcedureService } from '../base/crud/service-instances-table/service-instances-stored-procedure.service';
import { SessionsTableService } from '../base/crud/sessions-table/sessions-table.service';
import { TransactionsTableService } from '../base/crud/transactions-table/transactions-table.service';
import { UserTableService } from '../base/crud/user-table/user-table.service';
import { ServiceService } from '../base/service/services/service.service';
import { InvoicesTableService } from '../base/crud/invoices-table/invoices-table.service';
import { AitransactionsLogsStoredProcedureService } from '../base/crud/aitransactions-logs-table/aitransactions-logs-stored-procedure.service';
import { PayAsYouGoService } from '../base/service/services/pay-as-you-go.service';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { CreateAITransactionsLogsDto } from '../base/crud/aitransactions-logs-table/dto/create-aitransactions-logs.dto';
import { InvalidServiceInstanceIdException } from 'src/infrastructure/exceptions/invalid-service-instance-id.exception';
import { InvalidItemTypesException } from 'src/infrastructure/exceptions/invalid-item-types.exception';
import { InvalidTokenException } from 'src/infrastructure/exceptions/invalid-token.exception';

describe('AiController', () => {
  let controller: AiController;
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
  let plan: PlansTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [
        AiService,
        UserService,
        ServicePropertiesTableService,
        ServiceInstancesTableService,
        ServiceTypesTableService,
        AITransactionsLogsTableService,
        SettingTableService,
        ConfigsTableService,
        DiscountsService,
        TransactionsService,
        ItemTypesTableService,
        CreateServiceService,
        ServiceChecksService,
        PlansTableService,
        QualityPlansService,
        ServiceItemsTableService,
        ServiceItemsSumService,
        InvoicesService,
        InvoiceItemsTableService,
        InvoiceDiscountsTableService,
        InvoicesChecksService,
        CostCalculationService,
        InvoicePlansTableService,
        InvoicePropertiesTableService,
        VgpuService,
        SessionsService,
        SessionsService,
        UserTableService,
        ServiceInstancesStoredProcedureService,
        UserTableService,
        DiscountsTableService,
        TransactionsTableService,
        ServiceService,
        PlansQueryService,
        UserTableService,
        SessionsTableService,
        InvoicesTableService,
        AitransactionsLogsStoredProcedureService,
        PayAsYouGoService,
      ],
      controllers: [AiController],
    }).compile();

    controller = module.get<AiController>(AiController);
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
    plan = module.get<PlansTableService>(PlansTableService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(testDataService).toBeDefined();
  });

  describe('checkAradAiToken', () => {
    it('should call checkAIToken and return a CheckTokenDto', async () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJxdWFsaXR5UGxhbkNvZGUiOiJhaVBlcnNvbmFsIiwiY3JlYXRlZERhdGUiOiIyMDIzLTA3LTEwVDE2OjQ2OjEzLjQwMFoiLCJ1c2VySWQiOiI1ODciLCJkdXJhdGlvbiI6MTgwLCJleHBpcmVEYXRlIjoiMjAyNC0wMS0wNlQxNzo0NjoxMy4zOTdaIiwiY29zdFBlclJlcXVlc3QiOjUwLCJjb3N0UGVyTW9udGgiOjAsImlhdCI6MTY4OTAwNzU3NH0.kNp8f61qDC-ZhZp9WMfuV4nlO7C6hFgGF0UeoWzR3rw';
      const options = {};
      const mockCheckAIToken = true;
      const result = await controller.checkAradAiToken(token, options);
      expect(result).toEqual({ tokenValidity: mockCheckAIToken });
    });
  });

  describe('createAITransactionsLogs', () => {
    it('should create a new AITransactionsLogs and return it', async () => {
      const data: CreateAITransactionsLogsDto = {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJxdWFsaXR5UGxhbkNvZGUiOiJhaVBlcnNvbmFsIiwiY3JlYXRlZERhdGUiOiIyMDIzLTA3LTEwVDE2OjQ2OjEzLjQwMFoiLCJ1c2VySWQiOiI1ODciLCJkdXJhdGlvbiI6MTgwLCJleHBpcmVEYXRlIjoiMjAyNC0wMS0wNlQxNzo0NjoxMy4zOTdaIiwiY29zdFBlclJlcXVlc3QiOjUwLCJjb3N0UGVyTW9udGgiOjAsImlhdCI6MTY4OTAwNzU3NH0.kNp8f61qDC-ZhZp9WMfuV4nlO7C6hFgGF0UeoWzR3rw',
        description: 'translate',
        methodName: 'translate',
        request: 'http://172.20.51.101:8000/translate/',
        body: '{"text": "hello this is a test", "lang": "fa"}',
        response: '{"translatedText":"سلام این یک آزمایش است"}',
        ip: '172.22.20.16',
        method: 'POST',
        codeStatus: 200,
        itemType: null,
        serviceInstanceId: null,
      };
      const result = await controller.createAITransactionsLogs(data);
      expect(result);
      // .toEqual({ //undefind ??
      // });
    });

    it('should throw an InvalidServiceInstanceIdException if service properties is empty', async () => {
      const data: CreateAITransactionsLogsDto = {
        token:
          'eyJhbGhbkNvZGUiOiJhaVBlcnNvbmFsIiwiY3JlYXRlZELTA3LTEwVDE2OjQ2OjEzLjQwMFoiLCJ1c2VySWQiOiI1ODciLCJkdXJhdGlvbiI6MTgwLCJleHBpcmVEYXRlIjoiMjAyNC0wMS0wNlQxNzo0NjoxMy4zOTdaIiwiY29zdFBlclJlcXVlc3QiOjUwLCJjb3N0UGVyTW9udGgiOjAsImlhdCI6MTY4OTAwNzU3NH0.kNp8f61qDC-ZhZp9WMfuV4nlO7C6hFgGF0UeoWzR3rw',
        description: 'translate',
        methodName: 'translate',
        request: 'http://172.20.51.101:8000/translate/',
        body: '{"text": "hello this is a test", "lang": "fa"}',
        response: '{"translatedText":"سلام این یک آزمایش است"}',
        ip: '172.22.20.16',
        method: 'POST',
        codeStatus: 200,
        itemType: null,
        serviceInstanceId: null,
      };

      await expect(controller.createAITransactionsLogs(data)).rejects.toThrow(
        new InvalidServiceInstanceIdException(),
      );
    });

    it('should throw an InvalidItemTypesException if item types is empty', async () => {
      const data: CreateAITransactionsLogsDto = {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJxdWFsaXR5UGxhbkNvZGUiOiJhaVBlcnNvbmFsIiwiY3JlYXRlZERhdGUiOiIyMDIzLTA3LTEwVDE2OjQ2OjEzLjQwMFoiLCJ1c2VySWQiOiI1ODciLCJkdXJhdGlvbiI6MTgwLCJleHBpcmVEYXRlIjoiMjAyNC0wMS0wNlQxNzo0NjoxMy4zOTdaIiwiY29zdFBlclJlcXVlc3QiOjUwLCJjb3N0UGVyTW9udGgiOjAsImlhdCI6MTY4OTAwNzU3NH0.kNp8f61qDC-ZhZp9WMfuV4nlO7C6hFgGF0UeoWzR3rw',
        description: 'Dranslate',
        methodName: 'Dranslate',
        request: 'http://172.20.51.101:8000/translate/',
        body: '{"text": "hello this is a test", "lang": "fa"}',
        response: '{"translatedText":"سلام این یک آزمایش است"}',
        ip: '172.22.20.16',
        method: 'POST',
        codeStatus: 200,
        itemType: null,
        serviceInstanceId: null,
      };
      await expect(controller.createAITransactionsLogs(data)).rejects.toThrow(
        new InvalidItemTypesException(),
      );
    });
  });

  describe('createOrGetDemoToken', () => {
    it('should create a demo token and return it if it does not exist', async () => {
      const options = {
        user: {
          userId: 587,
        },
      };
      const mockToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJxdWFsaXR5UGxhbkNvZGUiOiJhaURlbW8iLCJjcmVhdGVkRGF0ZSI6IjIwMjMtMDYtMDFUMjM6Mjg6MzcuNjY0WiIsInVzZXJJZCI6IjU4NyIsImR1cmF0aW9uIjoxMiwiZXhwaXJlRGF0ZSI6IjIwMjQtMDUtMjZUMjM6Mjg6MzcuNjY0WiIsImNvc3RQZXJSZXF1ZXN0IjoxMDAsImNvc3RQZXJNb250aCI6MCwiaWF0IjoxNjg1NjYyMTE4fQ.dfU6LoZ1T2nYcBoIQhkXCfSUVsu64Ks-OrjplmGqpNA';

      const result = await controller.createOrGetDemoToken(options);
      expect(result);
      //.toEqual({ demoToken: mockToken });
    });

    it('should return the existing demo token if it exists', async () => {
      // const options = {
      // };
      // const result = await controller.createOrGetDemoToken(options);
      // expect(result).toEqual({ demoToken: 'existing_demo_token' });
    });
  });
  describe('getAradAiaDshboard', () => {
    it('should return the Arad AI dashboard', async () => {
      // TODO Procedure sp_count

      const options = {
        user: {
          id: 587,
        },
      };
      const serviceInstanceId = '7451E733-D18D-4329-B3FD-76429E4EDBEA';
      const mockDashboard = {};
      // jest.spyOn(service, 'getAradAIDashboard').mockResolvedValue(mockDashboard);

      // const result = await controller.getAradAiaDshboard(
      //   serviceInstanceId,
      //   options,
      // );

      // expect(service.getAradAIDashboard).toHaveBeenCalledWith(
      //   options.user.id,
      //   serviceInstanceId,
      // );
      // expect(result).toEqual(mockDashboard);
    });
  });

  describe('getAITransactionsLogs', () => {
    it('should return the AI transactions logs', async () => {
      // Arrange
      const options = {
        user: {
          id: 587,
        },
      };
      const serviceInstanceId = '7451E733-D18D-4329-B3FD-76429E4EDBEA';
      const page = 1;
      const pageSize = 20;

      const result = await controller.getAITransactionsLogs(
        serviceInstanceId,
        page,
        pageSize,
        options,
      );

      expect(result.aiTransactionsLogs).toEqual([]);
      expect(result.countAll).toEqual(0);
    });
  });

  describe('getDashboardChart', () => {
    it('should return the dashboard chart', async () => {
      // TODO create procedure

      const options = {
        user: {
          id: 637,
        },
      };
      const serviceInstanceId = '5578AF82-7B09-4AC4-B0B1-1068498159r4';
      const startDate = '2023-07-10';
      const endDate = '2023-07-11';
      const mockChart = {};

      // const result = await controller.getDashboardChart(
      //   serviceInstanceId,
      //   startDate,
      //   endDate,
      //   options,
      // );

      // // Assert
      // expect(result).toEqual(mockChart);
    });
  });
  describe('getAiPlans', () => {
    it('should return the AI plans', async () => {
      // Arrange
      const options = {
        user: {
          id: 597,
        },
      };
      // const result = await controller.getAiPlans(options);
      // expect(result).toEqual([
      //   {
      //     Code: 'aiPersonal',
      //     AdditionRatio: 0,
      //     Description: 'Description',
      //     Condition: '@ServiceTypeID="aradAi"',
      //     AdditionAmount: 0,
      //     CostPerRequest: 300,
      //     Items: [
      //       {
      //         ID: 81,
      //         ServiceTypeID: 'aradAi',
      //         Title: 'ترجمه',
      //         Unit: 'token',
      //         Fee: 500,
      //         Code: 'translate',
      //         MaxAvailable: 10,
      //         MaxPerRequest: 10,
      //         MinPerRequest: null,
      //         AddressDemo: 'http://localhost:8080/api/v1/demo/?itemId=2',
      //       },
      //     ],
      //   },
      // ]);
    });
  });
});
