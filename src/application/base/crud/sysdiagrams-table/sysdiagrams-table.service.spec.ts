import { Test, TestingModule } from '@nestjs/testing';
import { SysdiagramsTableService } from './sysdiagrams-table.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('sysdiagramsTableService', () => {
  let service: SysdiagramsTableService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [SysdiagramsTableService, TestDataService],
    }).compile();

    service = module.get<SysdiagramsTableService>(SysdiagramsTableService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
