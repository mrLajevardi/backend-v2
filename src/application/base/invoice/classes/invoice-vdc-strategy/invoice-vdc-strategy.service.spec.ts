import { InvoiceVdcStrategyService } from './invoice-vdc-strategy.service';
import { TestBed } from '@automock/jest';

describe('InvoiceVdcStrategyService', () => {
  let service: InvoiceVdcStrategyService;

  beforeEach(async () => {
    const { unit } = TestBed.create(InvoiceVdcStrategyService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
