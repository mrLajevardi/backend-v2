
import { Test, TestingModule } from '@nestjs/testing';
import { InvoicePlansTableService } from './invoice-plans-table.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('InvoicePlansTableService', () => {
  let service: InvoicePlansTableService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [InvoicePlansTableService, TestDataService],
    }).compile();

    service = module.get<InvoicePlansTableService>(InvoicePlansTableService);
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
			