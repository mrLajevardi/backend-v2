import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceDiscountsTableService } from './invoice-discounts-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('InvoiceDiscountsTableService', () => {
  let service: InvoiceDiscountsTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [InvoiceDiscountsTableService, TestDataService],
    }).compile();

    service = module.get<InvoiceDiscountsTableService>(
      InvoiceDiscountsTableService,
    );
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
