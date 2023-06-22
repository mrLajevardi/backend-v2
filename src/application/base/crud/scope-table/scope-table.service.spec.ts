
import { Test, TestingModule } from '@nestjs/testing';
import { ScopeTableService } from './scope-table.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('ScopeTableService', () => {
  let service: ScopeTableService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ScopeTableService, TestDataService],
    }).compile();

    service = module.get<ScopeTableService>(ScopeTableService);
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
			