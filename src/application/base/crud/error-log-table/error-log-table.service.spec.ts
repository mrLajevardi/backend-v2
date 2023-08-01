import { Test, TestingModule } from '@nestjs/testing';
import { ErrorLogTableService } from './error-log-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('ErrorLogTableService', () => {
  let service: ErrorLogTableService;
  let module : TestingModule; 

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ErrorLogTableService, TestDataService],
    }).compile();

    service = module.get<ErrorLogTableService>(ErrorLogTableService);
  });

  afterAll(async ()=>{
    await module.close();
  })
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
