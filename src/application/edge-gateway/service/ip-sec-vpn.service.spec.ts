import { IpSecVpnService } from './ip-sec-vpn.service';
import { TestBed } from '@automock/jest';

describe('IpSecVpnService', () => {
  let service: IpSecVpnService;

  beforeAll(async () => {
    const { unit } = TestBed.create(IpSecVpnService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
