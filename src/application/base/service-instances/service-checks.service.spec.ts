import { Test, TestingModule } from '@nestjs/testing';
import { ServiceChecksService } from './service-checks.service';

describe('ServiceChecksService', () => {
  let service: ServiceChecksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceChecksService],
    }).compile();

    service = module.get<ServiceChecksService>(ServiceChecksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
