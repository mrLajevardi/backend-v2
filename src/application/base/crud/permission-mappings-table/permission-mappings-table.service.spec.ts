import { Test, TestingModule } from '@nestjs/testing';
import { PermissionMappingsTableService } from './permission-mappings-table.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('PermissionMappingsTableService', () => {
  let service: PermissionMappingsTableService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [PermissionMappingsTableService, TestDataService],
    }).compile();

    service = module.get<PermissionMappingsTableService>(
      PermissionMappingsTableService,
    );
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
