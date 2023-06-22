
import { Test, TestingModule } from '@nestjs/testing';
import { RoleMappingTableService } from './role-mapping-table.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('RoleMappingTableService', () => {
  let service: RoleMappingTableService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [RoleMappingTableService, TestDataService],
    }).compile();

    service = module.get<RoleMappingTableService>(RoleMappingTableService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


});
			