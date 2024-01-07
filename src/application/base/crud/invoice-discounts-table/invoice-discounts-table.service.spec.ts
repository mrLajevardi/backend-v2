import { InvoiceDiscountsTableService } from './invoice-discounts-table.service';
import { TestBed } from '@automock/jest';

describe('InvoiceDiscountsTableService', () => {
  let service: InvoiceDiscountsTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(InvoiceDiscountsTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
