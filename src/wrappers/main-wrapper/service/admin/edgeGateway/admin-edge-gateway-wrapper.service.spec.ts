import { AdminEdgeGatewayWrapperService } from './admin-edge-gateway-wrapper.service';
import { TestBed } from '@automock/jest';

describe('AdminEdgeGatewayWrapperService', () => {
  let service: AdminEdgeGatewayWrapperService;

  beforeAll(async () => {
    const { unit } = TestBed.create(AdminEdgeGatewayWrapperService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
