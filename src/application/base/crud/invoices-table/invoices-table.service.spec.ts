import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesTableService } from './invoices-table.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('InvoicesTableService', () => {
  let service: InvoicesTableService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [InvoicesTableService, TestDataService],
    }).compile();

    service = module.get<InvoicesTableService>(InvoicesTableService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
