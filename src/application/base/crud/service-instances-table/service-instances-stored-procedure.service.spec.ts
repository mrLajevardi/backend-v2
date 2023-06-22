import { Test, TestingModule } from '@nestjs/testing';
import { ServiceInstancesStoredProcedureService } from './service-instances-stored-procedure.service';

describe('ServiceInstancesStoredProcedureService', () => {
  let service: ServiceInstancesStoredProcedureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceInstancesStoredProcedureService],
    }).compile();

    service = module.get<ServiceInstancesStoredProcedureService>(ServiceInstancesStoredProcedureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
