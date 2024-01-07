import { InvoicesQueryService } from './invoices-query.service';
import { TestBed } from '@automock/jest';

describe('InvoicesQueryService', () => {
  let service: InvoicesQueryService;

  beforeEach(async () => {
    const { unit } = TestBed.create(InvoicesQueryService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
