import { Test, TestingModule } from '@nestjs/testing';
import { DebugLogTableService } from './debug-log-table.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('DebugLogTableService', () => {
  let service: DebugLogTableService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [DebugLogTableService, TestDataService],
    }).compile();

    service = module.get<DebugLogTableService>(DebugLogTableService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
