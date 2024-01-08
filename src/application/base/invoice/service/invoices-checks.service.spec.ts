import { InvoicesChecksService } from './invoices-checks.service';
import { TestBed } from '@automock/jest';

describe('InvoicesChecksService', () => {
  let service: InvoicesChecksService;

  beforeAll(async () => {
    const { unit } = TestBed.create(InvoicesChecksService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
