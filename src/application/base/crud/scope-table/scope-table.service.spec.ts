import { Test, TestingModule } from '@nestjs/testing';
import { ScopeTableService } from './scope-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('ScopeTableService', () => {
  let service: ScopeTableService;
  let module : TestingModule; 

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ScopeTableService, TestDataService],
    }).compile();

    service = module.get<ScopeTableService>(ScopeTableService);
  });

  afterAll(async ()=>{
    await module.close();
  })
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
