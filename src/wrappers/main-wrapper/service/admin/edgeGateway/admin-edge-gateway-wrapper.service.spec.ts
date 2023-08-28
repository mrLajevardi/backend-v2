import { Test, TestingModule } from '@nestjs/testing';
import { AdminEdgeGatewayWrapperService } from './admin-edge-gateway-wrapper.service';
import { VcloudWrapperModule } from 'src/wrappers/vcloud-wrapper/vcloud-wrapper.module';

describe('AdminEdgeGatewayWrapperService', () => {
  let service: AdminEdgeGatewayWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [VcloudWrapperModule],
      providers: [AdminEdgeGatewayWrapperService],
    }).compile();

    service = module.get<AdminEdgeGatewayWrapperService>(
      AdminEdgeGatewayWrapperService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
