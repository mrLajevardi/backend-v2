import { PaygInvoiceService } from './payg-invoice.service';
import { TestBed } from '@automock/jest';

describe('PaygInvoiceService', () => {
  let service: PaygInvoiceService;

  beforeAll(async () => {
    const { unit } = TestBed.create(PaygInvoiceService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
