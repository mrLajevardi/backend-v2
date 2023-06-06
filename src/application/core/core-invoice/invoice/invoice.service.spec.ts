import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('InvoiceService', () => {
  let service: InvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [InvoiceService],
      
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  
});
