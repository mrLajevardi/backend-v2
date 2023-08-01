import { Test, TestingModule } from '@nestjs/testing';
import { PlansTableService } from './plans-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('PlansTableService', () => {
  let service: PlansTableService;
  let module : TestingModule; 

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [PlansTableService, TestDataService],
    }).compile();

    service = module.get<PlansTableService>(PlansTableService);
  });

  afterAll(async ()=>{
    await module.close();
  })
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
