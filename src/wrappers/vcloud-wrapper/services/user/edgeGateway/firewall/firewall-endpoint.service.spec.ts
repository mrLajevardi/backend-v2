import { Test, TestingModule } from '@nestjs/testing';
import { FirewallEndpointService } from './firewall-endpoint.service';

describe('FirewallEndpointService', () => {
  let service: FirwallEndpointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirwallEndpointService],
    }).compile();

    service = module.get<FirwallEndpointService>(FirwallEndpointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
