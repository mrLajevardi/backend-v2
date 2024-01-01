import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesTableService } from './invoices-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('InvoicesTableService', () => {
  let service: InvoicesTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [InvoicesTableService, TestDataService],
    }).compile();

    service = module.get<InvoicesTableService>(InvoicesTableService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
