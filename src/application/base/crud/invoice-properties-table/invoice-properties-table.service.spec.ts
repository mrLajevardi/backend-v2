import { InvoicePropertiesTableService } from './invoice-properties-table.service';
import { TestBed } from '@automock/jest';

describe('InvoicePropertiesTableService', () => {
  let service: InvoicePropertiesTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(InvoicePropertiesTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
