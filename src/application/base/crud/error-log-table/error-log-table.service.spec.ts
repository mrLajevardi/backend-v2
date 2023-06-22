
import { Test, TestingModule } from '@nestjs/testing';
import { ErrorLogTableService } from './error-log-table.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('ErrorLogTableService', () => {
  let service: ErrorLogTableService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ErrorLogTableService, TestDataService],
    }).compile();

    service = module.get<ErrorLogTableService>(ErrorLogTableService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


});
			