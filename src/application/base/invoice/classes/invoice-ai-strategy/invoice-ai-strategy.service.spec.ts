import { InvoiceAiStrategyService } from './invoice-ai-strategy.service';
import { TestBed } from '@automock/jest';

describe('InvoiceAiStrategyService', () => {
  let service: InvoiceAiStrategyService;

  beforeEach(async () => {
    const { unit } = TestBed.create(InvoiceAiStrategyService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
