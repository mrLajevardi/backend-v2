import { TestBed } from '@automock/jest';
import { FirewallEndpointService } from './firewall-endpoint.service';

describe('FirewallEndpointService', () => {
  let service: FirewallEndpointService;

  beforeAll(async () => {
    const { unit } = TestBed.create(FirewallEndpointService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
