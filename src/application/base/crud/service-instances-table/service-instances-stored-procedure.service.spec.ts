import { Test, TestingModule } from '@nestjs/testing';
import { ServiceInstancesStoredProcedureService } from './service-instances-stored-procedure.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('ServiceInstancesStoredProcedureService', () => {
  let service: ServiceInstancesStoredProcedureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [ServiceInstancesStoredProcedureService],
    }).compile();

    service = module.get<ServiceInstancesStoredProcedureService>(ServiceInstancesStoredProcedureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
