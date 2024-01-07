import { EdgeGatewayEndpointService } from './edge-gateway-endpoint.service';
import { TestBed } from '@automock/jest';

describe('EdgeGatewayEndpointService', () => {
  let service: EdgeGatewayEndpointService;

  beforeAll(async () => {
    const { unit } = TestBed.create(EdgeGatewayEndpointService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
