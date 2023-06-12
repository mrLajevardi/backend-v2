import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesChecksService } from './invoices-checks.service';

describe('InvoicesChecksService', () => {
  let service: InvoicesChecksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoicesChecksService],
    }).compile();

    service = module.get<InvoicesChecksService>(InvoicesChecksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
