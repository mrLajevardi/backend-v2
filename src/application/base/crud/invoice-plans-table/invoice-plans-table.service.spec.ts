import { Test, TestingModule } from '@nestjs/testing';
import { InvoicePlansTableService } from './invoice-plans-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('InvoicePlansTableService', () => {
  let service: InvoicePlansTableService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [InvoicePlansTableService, TestDataService],
    }).compile();

    service = module.get<InvoicePlansTableService>(InvoicePlansTableService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
