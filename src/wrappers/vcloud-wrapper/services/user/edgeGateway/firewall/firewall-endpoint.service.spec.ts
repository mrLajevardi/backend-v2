import { Test, TestingModule } from '@nestjs/testing';
import { FirewallEndpointService } from './firewall-endpoint.service';

describe('FirewallEndpointService', () => {
  let service: FirewallEndpointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirewallEndpointService],
    }).compile();

    service = module.get<FirewallEndpointService>(FirewallEndpointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
