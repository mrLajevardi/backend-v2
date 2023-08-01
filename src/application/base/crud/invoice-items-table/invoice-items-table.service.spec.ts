import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceItemsTableService } from './invoice-items-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('InvoiceItemsTableService', () => {
  let service: InvoiceItemsTableService;
  let module : TestingModule; 

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [InvoiceItemsTableService, TestDataService],
    }).compile();

    service = module.get<InvoiceItemsTableService>(InvoiceItemsTableService);
  });

  afterAll(async ()=>{
    await module.close();
  })
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
