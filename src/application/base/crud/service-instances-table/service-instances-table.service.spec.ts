import { Test, TestingModule } from '@nestjs/testing';
import { ServiceInstancesTableService } from './service-instances-table.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('ServiceInstancesTableService', () => {
  let service: ServiceInstancesTableService;
  let module : TestingModule; 

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ServiceInstancesTableService, TestDataService],
    }).compile();

    service = module.get<ServiceInstancesTableService>(
      ServiceInstancesTableService,
    );
  });

  afterAll(async ()=>{
    await module.close();
  })
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
