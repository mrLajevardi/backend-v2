import { Test, TestingModule } from '@nestjs/testing';
import { IpSecVpnEndpointService } from './ip-sec-vpn-endpoint.service';

describe('IpSecVpnEndpointService', () => {
  let service: IpSecVpnEndpointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IpSecVpnEndpointService],
    }).compile();

    service = module.get<IpSecVpnEndpointService>(IpSecVpnEndpointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
