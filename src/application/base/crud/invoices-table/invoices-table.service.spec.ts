import { InvoicesTableService } from './invoices-table.service';
import { TestBed } from '@automock/jest';

describe('InvoicesTableService', () => {
  let service: InvoicesTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(InvoicesTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
