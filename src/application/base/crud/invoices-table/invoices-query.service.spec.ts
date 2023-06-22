import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesQueryService } from './invoices-query.service';

describe('InvoicesQueryService', () => {
  let service: InvoicesQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoicesQueryService],
    }).compile();

    service = module.get<InvoicesQueryService>(InvoicesQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
