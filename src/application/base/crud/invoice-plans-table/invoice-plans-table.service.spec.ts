import { InvoicePlansTableService } from './invoice-plans-table.service';
import { TestBed } from '@automock/jest';

describe('InvoicePlansTableService', () => {
  let service: InvoicePlansTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(InvoicePlansTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
