import { Test, TestingModule } from '@nestjs/testing';
import { InfoLogTableService } from './info-log-table.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('InfoLogTableService', () => {
  let service: InfoLogTableService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [InfoLogTableService, TestDataService],
    }).compile();

    service = module.get<InfoLogTableService>(InfoLogTableService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
