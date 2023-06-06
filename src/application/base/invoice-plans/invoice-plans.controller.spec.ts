import { Test, TestingModule } from '@nestjs/testing';
import { InvoicePlansService } from './invoice-plans.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('InvoicePlansService', () => {
  let service: InvoicePlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [InvoicePlansService],
    }).compile();

    service = module.get<InvoicePlansService>(InvoicePlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
