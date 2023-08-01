import { Test, TestingModule } from '@nestjs/testing';
import { ServiceItemsTableService } from './service-items-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('ServiceItemsTableService', () => {
  let service: ServiceItemsTableService;
  let module : TestingModule; 

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ServiceItemsTableService, TestDataService],
    }).compile();

    service = module.get<ServiceItemsTableService>(ServiceItemsTableService);
  });

  afterAll(async ()=>{
    await module.close();
  })
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
