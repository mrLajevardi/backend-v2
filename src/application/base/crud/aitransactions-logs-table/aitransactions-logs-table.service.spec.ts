
import { Test, TestingModule } from '@nestjs/testing';
import { AITransactionsLogsTableService } from './aitransactions-logs-table.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('AITransactionsLogsTableService', () => {
  let service: AITransactionsLogsTableService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [AITransactionsLogsTableService, TestDataService],
    }).compile();

    service = module.get<AITransactionsLogsTableService>(AITransactionsLogsTableService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


});
			