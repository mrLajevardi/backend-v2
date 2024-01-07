import { InvoiceItemsTableService } from './invoice-items-table.service';
import { TestBed } from '@automock/jest';

describe('InvoiceItemsTableService', () => {
  let service: InvoiceItemsTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(InvoiceItemsTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
