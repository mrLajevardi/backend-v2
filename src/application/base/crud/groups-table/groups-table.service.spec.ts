
import { Test, TestingModule } from '@nestjs/testing';
import { GroupsTableService } from './groups-table.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('GroupsTableService', () => {
  let service: GroupsTableService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [GroupsTableService, TestDataService],
    }).compile();

    service = module.get<GroupsTableService>(GroupsTableService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


});
			