import { Test, TestingModule } from '@nestjs/testing';
import { VdcEndpointService } from './vdc-endpoint.service';

describe('VdcEndpointService', () => {
  let service: VdcEndpointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VdcEndpointService],
    }).compile();

    service = module.get<VdcEndpointService>(VdcEndpointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
