import { Test, TestingModule } from '@nestjs/testing';
import { ServicePropertiesService } from './service-properties.service';

describe('ServicePropertiesService', () => {
  let service: ServicePropertiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicePropertiesService],
    }).compile();

    service = module.get<ServicePropertiesService>(ServicePropertiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
