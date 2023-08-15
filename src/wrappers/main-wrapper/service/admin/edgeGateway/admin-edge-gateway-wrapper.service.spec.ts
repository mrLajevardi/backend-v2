import { Test, TestingModule } from '@nestjs/testing';
import { AdminEdgeGatewayWrapperService } from './admin-edge-gateway-wrapper.service';

describe('AdminEdgeGatewayWrapperService', () => {
  let service: AdminEdgeGatewayWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminEdgeGatewayWrapperService],
    }).compile();

    service = module.get<AdminEdgeGatewayWrapperService>(AdminEdgeGatewayWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
