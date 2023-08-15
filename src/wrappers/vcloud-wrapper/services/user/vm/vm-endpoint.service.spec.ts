import { Test, TestingModule } from '@nestjs/testing';
import { VmEndpointService } from './vm-endpoint.service';

describe('VmEndpointService', () => {
  let service: VmEndpointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VmEndpointService],
    }).compile();

    service = module.get<VmEndpointService>(VmEndpointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
