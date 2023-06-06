import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceItemsService } from './invoice-items.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('InvoiceItemsService', () => {
  let service: InvoiceItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [InvoiceItemsService],
    }).compile();

    service = module.get<InvoiceItemsService>(InvoiceItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
