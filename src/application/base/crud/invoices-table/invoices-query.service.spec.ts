import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesQueryService } from './invoices-query.service';

describe('InvoicesQueryService', () => {
  let service: InvoicesQueryService;
  let module : TestingModule; 

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [InvoicesQueryService],
    }).compile();

    service = module.get<InvoicesQueryService>(InvoicesQueryService);
  });

  afterAll(async ()=>{
    await module.close();
  })
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
