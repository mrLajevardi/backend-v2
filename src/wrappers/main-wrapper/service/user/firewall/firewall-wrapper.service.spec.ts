import { Test, TestingModule } from '@nestjs/testing';
import { FirewallWrapperService } from './firewall-wrapper.service';
import { VcloudWrapperModule } from 'src/wrappers/vcloud-wrapper/vcloud-wrapper.module';
import { EdgeGatewayWrapperService } from '../edgeGateway/edge-gateway-wrapper.service';

describe('FirewallWrapperService', () => {
  let service: FirewallWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [VcloudWrapperModule],
      providers: [FirewallWrapperService, EdgeGatewayWrapperService],
    }).compile();

    service = module.get<FirewallWrapperService>(FirewallWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
