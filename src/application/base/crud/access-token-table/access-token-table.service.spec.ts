
import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenTableService } from './access-token-table.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('AccessTokenTableService', () => {
  let service: AccessTokenTableService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [AccessTokenTableService, TestDataService],
    }).compile();

    service = module.get<AccessTokenTableService>(AccessTokenTableService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


});
			