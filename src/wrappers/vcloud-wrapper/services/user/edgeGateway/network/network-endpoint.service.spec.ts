import { NetworkEndpointService } from './network-endpoint.service';
import { TestBed } from '@automock/jest';

describe('NetworkEndpointService', () => {
  let service: NetworkEndpointService;

  beforeAll(async () => {
    const { unit } = TestBed.create(NetworkEndpointService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
