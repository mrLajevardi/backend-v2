import { Test, TestingModule } from '@nestjs/testing';
import { NatWrapperService } from './nat-wrapper.service';
import { VcloudWrapperModule } from 'src/wrappers/vcloud-wrapper/vcloud-wrapper.module';
import { EdgeGatewayWrapperService } from '../edgeGateway/edge-gateway-wrapper.service';

describe('NatWrapperService', () => {
  let service: NatWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [VcloudWrapperModule],
      providers: [NatWrapperService, EdgeGatewayWrapperService],
    }).compile();

    service = module.get<NatWrapperService>(NatWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
