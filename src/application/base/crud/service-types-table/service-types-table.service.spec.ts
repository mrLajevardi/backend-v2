
import { Test, TestingModule } from '@nestjs/testing';
import { ServiceTypesTableService } from './service-types-table.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('ServiceTypesTableService', () => {
  let service: ServiceTypesTableService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ServiceTypesTableService, TestDataService],
    }).compile();

    service = module.get<ServiceTypesTableService>(ServiceTypesTableService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


});
			