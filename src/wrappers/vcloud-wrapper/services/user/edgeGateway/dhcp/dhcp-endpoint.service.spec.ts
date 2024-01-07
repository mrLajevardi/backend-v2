import { DhcpEndpointService } from './dhcp-endpoint.service';
import { TestBed } from '@automock/jest';

describe('DhcpEndpointService', () => {
  let service: DhcpEndpointService;

  beforeAll(async () => {
    const { unit } = TestBed.create(DhcpEndpointService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
