import { Test, TestingModule } from '@nestjs/testing';
import { NetworkWrapperService } from './network-wrapper.service';
import { EdgeGatewayWrapperService } from '../edgeGateway/edge-gateway-wrapper.service';
import { VcloudWrapperModule } from 'src/wrappers/vcloud-wrapper/vcloud-wrapper.module';

describe('NetworkWrapperService', () => {
  let service: NetworkWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [VcloudWrapperModule],
      providers: [NetworkWrapperService, EdgeGatewayWrapperService],
    }).compile();

    service = module.get<NetworkWrapperService>(NetworkWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
