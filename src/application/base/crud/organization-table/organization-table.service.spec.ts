
import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationTableService } from './organization-table.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('OrganizationTableService', () => {
  let service: OrganizationTableService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [OrganizationTableService, TestDataService],
    }).compile();

    service = module.get<OrganizationTableService>(OrganizationTableService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


});
			