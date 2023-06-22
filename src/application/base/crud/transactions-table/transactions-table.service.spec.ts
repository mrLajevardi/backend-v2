import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsTableService } from './transactions-table.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('TransactionsTableService', () => {
  let service: TransactionsTableService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [TransactionsTableService, TestDataService],
    }).compile();

    service = module.get<TransactionsTableService>(TransactionsTableService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
