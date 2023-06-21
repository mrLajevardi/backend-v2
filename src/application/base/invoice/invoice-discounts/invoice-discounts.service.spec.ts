import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceDiscountsService } from './invoice-discounts.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('InvoiceDiscountsService', () => {
  let service: InvoiceDiscountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [InvoiceDiscountsService],
    }).compile();

    service = module.get<InvoiceDiscountsService>(InvoiceDiscountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
