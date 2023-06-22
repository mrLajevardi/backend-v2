import { Test, TestingModule } from '@nestjs/testing';
import { SettingTableService } from './setting-table.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('SettingTableService', () => {
  let service: SettingTableService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [SettingTableService, TestDataService],
    }).compile();

    service = module.get<SettingTableService>(SettingTableService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
