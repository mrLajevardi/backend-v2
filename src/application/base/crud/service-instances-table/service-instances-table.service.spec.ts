import { Test, TestingModule } from '@nestjs/testing';
import { ServiceInstancesTableService } from './service-instances-table.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('ServiceInstancesTableService', () => {
  let service: ServiceInstancesTableService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ServiceInstancesTableService, TestDataService],
    }).compile();

    service = module.get<ServiceInstancesTableService>(
      ServiceInstancesTableService,
    );
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
