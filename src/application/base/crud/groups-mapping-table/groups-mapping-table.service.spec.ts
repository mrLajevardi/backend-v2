
import { Test, TestingModule } from '@nestjs/testing';
import { GroupsMappingTableService } from './groups-mapping-table.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('GroupsMappingTableService', () => {
  let service: GroupsMappingTableService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [GroupsMappingTableService, TestDataService],
    }).compile();

    service = module.get<GroupsMappingTableService>(GroupsMappingTableService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return more than 0 ', async () => {
    const result = await service.find();
    expect(result.length).toBeGreaterThan(0);
  });
});
			