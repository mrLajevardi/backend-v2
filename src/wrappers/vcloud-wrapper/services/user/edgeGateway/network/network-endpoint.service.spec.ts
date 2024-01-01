import { Test, TestingModule } from '@nestjs/testing';
import { NetworkEndpointService } from './network-endpoint.service';

describe('NetworkEndpointService', () => {
  let service: NetworkEndpointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NetworkEndpointService],
    }).compile();

    service = module.get<NetworkEndpointService>(NetworkEndpointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
