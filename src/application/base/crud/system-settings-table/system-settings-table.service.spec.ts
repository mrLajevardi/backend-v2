
import { Test, TestingModule } from '@nestjs/testing';
import { SystemSettingsTableService } from './system-settings-table.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('SystemSettingsTableService', () => {
  let service: SystemSettingsTableService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [SystemSettingsTableService, TestDataService],
    }).compile();

    service = module.get<SystemSettingsTableService>(SystemSettingsTableService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


});
			