import { Test, TestingModule } from '@nestjs/testing';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { ServicePlansTableService } from './service-plans-table.service';

describe('ServicePlansTableService', () => {
  let service: ServicePlansTableService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ServicePlansTableService, TestDataService],
    }).compile();

    service = module.get<ServicePlansTableService>(ServicePlansTableService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
