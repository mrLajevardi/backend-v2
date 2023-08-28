import { Test, TestingModule } from '@nestjs/testing';
import { DhcpEndpointService } from './dhcp-endpoint.service';

describe('DhcpEndpointService', () => {
  let service: DhcpEndpointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DhcpEndpointService],
    }).compile();

    service = module.get<DhcpEndpointService>(DhcpEndpointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
