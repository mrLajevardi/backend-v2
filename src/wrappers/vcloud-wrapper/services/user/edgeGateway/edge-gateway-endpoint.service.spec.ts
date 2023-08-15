import { Test, TestingModule } from '@nestjs/testing';
import { EdgeGatewayEndpointService } from './edge-gateway-endpoint.service';

describe('EdgeGatewayEndpointService', () => {
  let service: EdgeGatewayEndpointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EdgeGatewayEndpointService],
    }).compile();

    service = module.get<EdgeGatewayEndpointService>(
      EdgeGatewayEndpointService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
