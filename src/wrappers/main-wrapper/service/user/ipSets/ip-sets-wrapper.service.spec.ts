import { Test, TestingModule } from '@nestjs/testing';
import { IpSetsWrapperService } from './ip-sets-wrapper.service';
import { EdgeGatewayWrapperService } from '../edgeGateway/edge-gateway-wrapper.service';
import { VcloudWrapperModule } from 'src/wrappers/vcloud-wrapper/vcloud-wrapper.module';

describe('IpSetsWrapperService', () => {
  let service: IpSetsWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [VcloudWrapperModule],
      providers: [IpSetsWrapperService, EdgeGatewayWrapperService],
    }).compile();

    service = module.get<IpSetsWrapperService>(IpSetsWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
