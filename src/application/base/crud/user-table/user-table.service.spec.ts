
import { Test, TestingModule } from '@nestjs/testing';
import { UserTableService } from './user-table.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('UserTableService', () => {
  let service: UserTableService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [UserTableService, TestDataService],
    }).compile();

    service = module.get<UserTableService>(UserTableService);
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
			