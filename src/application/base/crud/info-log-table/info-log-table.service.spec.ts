import { Test, TestingModule } from '@nestjs/testing';
import { InfoLogTableService } from './info-log-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('InfoLogTableService', () => {
  let service: InfoLogTableService;
  let module : TestingModule; 

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [InfoLogTableService, TestDataService],
    }).compile();

    service = module.get<InfoLogTableService>(InfoLogTableService);
  });

  afterAll(async ()=>{
    await module.close();
  })
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
