import { InvoiceItemListService } from './invoice-item-list.service';
import { TestBed } from '@automock/jest';

describe('InvoiceItemLlist', () => {
  let service: InvoiceItemListService;

  beforeEach(async () => {
    const { unit } = TestBed.create(InvoiceItemListService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
