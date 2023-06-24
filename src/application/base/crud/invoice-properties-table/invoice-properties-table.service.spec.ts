import { Test, TestingModule } from '@nestjs/testing';
import { InvoicePropertiesTableService } from './invoice-properties-table.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('InvoicePropertiesTableService', () => {
  let service: InvoicePropertiesTableService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [InvoicePropertiesTableService, TestDataService],
    }).compile();

    service = module.get<InvoicePropertiesTableService>(
      InvoicePropertiesTableService,
    );
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
