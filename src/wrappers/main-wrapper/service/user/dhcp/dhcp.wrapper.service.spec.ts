import { Test, TestingModule } from '@nestjs/testing';
import { DhcpWrapperService } from './dhcp-wrapper.service';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { EdgeGatewayWrapperService } from '../edgeGateway/edge-gateway-wrapper.service';
import { VcloudWrapperModule } from 'src/wrappers/vcloud-wrapper/vcloud-wrapper.module';

describe('DhcpService', () => {
  let service: DhcpWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [VcloudWrapperModule],
      providers: [DhcpWrapperService, EdgeGatewayWrapperService],
    }).compile();

    service = module.get<DhcpWrapperService>(DhcpWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
