
import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceItemsTableService } from './invoice-items-table.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('InvoiceItemsTableService', () => {
  let service: InvoiceItemsTableService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [InvoiceItemsTableService, TestDataService],
    }).compile();

    service = module.get<InvoiceItemsTableService>(InvoiceItemsTableService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


});
			