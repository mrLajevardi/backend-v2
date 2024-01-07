import { AdminEdgeGatewayEndpointService } from './admin-edge-gateway-endpoint.service';
import { TestBed } from '@automock/jest';

describe('AdminEdgeGatewayEndpointService', () => {
  let service: AdminEdgeGatewayEndpointService;

  beforeAll(async () => {
    const { unit } = TestBed.create(AdminEdgeGatewayEndpointService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
