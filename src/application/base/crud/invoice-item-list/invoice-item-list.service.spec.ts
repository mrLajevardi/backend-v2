import { Test, TestingModule } from '@nestjs/testing';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { InvoiceItemListService } from './invoice-item-list.service';

describe('InvoiceItemLlist', () => {
  let service: InvoiceItemListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [InvoiceItemListService],
    }).compile();

    service = module.get<InvoiceItemListService>(InvoiceItemListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
