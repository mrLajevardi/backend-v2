import { Test, TestingModule } from '@nestjs/testing';
import { AdminVdcWrapperService } from './admin-vdc-wrapper.service';
import { AdminEdgeGatewayWrapperService } from '../edgeGateway/admin-edge-gateway-wrapper.service';
import { VcloudWrapperModule } from 'src/wrappers/vcloud-wrapper/vcloud-wrapper.module';

describe('AdminVdcWrapperService', () => {
  let service: AdminVdcWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [VcloudWrapperModule],
      providers: [AdminVdcWrapperService, AdminEdgeGatewayWrapperService],
    }).compile();

    service = module.get<AdminVdcWrapperService>(AdminVdcWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
