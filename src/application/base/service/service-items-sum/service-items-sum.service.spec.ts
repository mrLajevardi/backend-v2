import { Test, TestingModule } from '@nestjs/testing';
import { ServiceItemsSumService } from './service-items-sum.service';

describe('ServiceItemsSumService', () => {
  let service: ServiceItemsSumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceItemsSumService],
    }).compile();

    service = module.get<ServiceItemsSumService>(ServiceItemsSumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
