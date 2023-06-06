import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('InvoicesService', () => {
  let service: InvoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [InvoicesService],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
