import { Test, TestingModule } from '@nestjs/testing';
import { ServiceInstancesStoredProcedureService } from './service-instances-stored-procedure.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('ServiceInstancesStoredProcedureService', () => {
  let service: ServiceInstancesStoredProcedureService;
  let module : TestingModule; 

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [ServiceInstancesStoredProcedureService],
    }).compile();

    service = module.get<ServiceInstancesStoredProcedureService>(
      ServiceInstancesStoredProcedureService,
    );
  });

  afterAll(async ()=>{
    await module.close();
  })
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
