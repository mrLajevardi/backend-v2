import { Test, TestingModule } from '@nestjs/testing';
import { ServiceInstancesService } from './service-instances.service';

describe('ServiceInstancesService', () => {
  let service: ServiceInstancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceInstancesService],
    }).compile();

    service = module.get<ServiceInstancesService>(ServiceInstancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
