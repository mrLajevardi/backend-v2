import { Test, TestingModule } from '@nestjs/testing';
import { TicketsTableService } from './tickets-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('TicketsTableService', () => {
  let service: TicketsTableService;
  let module : TestingModule; 

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [TicketsTableService, TestDataService],
    }).compile();

    service = module.get<TicketsTableService>(TicketsTableService);
  });

  afterAll(async ()=>{
    await module.close();
  })
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
