import { Test, TestingModule } from '@nestjs/testing';
import { AdminEdgeGatewayEndpointService } from './admin-edge-gateway-endpoint.service';

describe('AdminEdgeGatewayEndpointService', () => {
  let service: AdminEdgeGatewayEndpointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminEdgeGatewayEndpointService],
    }).compile();

    service = module.get<AdminEdgeGatewayEndpointService>(AdminEdgeGatewayEndpointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
