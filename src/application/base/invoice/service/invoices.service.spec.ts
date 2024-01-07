import { InvoicesService } from './invoices.service';
import { TestBed } from '@automock/jest';

describe('InvoicesService', () => {
  let service: InvoicesService;

  beforeAll(async () => {
    const { unit } = TestBed.create(InvoicesService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
