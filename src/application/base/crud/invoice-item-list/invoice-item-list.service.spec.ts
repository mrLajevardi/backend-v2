import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { InvoiceItemListService } from './invoice-item-list.service';

describe('InvoiceItemLlist', () => {
  let service: InvoiceItemListService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [InvoiceItemListService],
    }).compile();

    service = module.get<InvoiceItemListService>(InvoiceItemListService);
  });

  afterAll(async () => {
    await module.close();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
