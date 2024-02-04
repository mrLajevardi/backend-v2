import { TestBed } from '@automock/jest';
import { IpSecVpnWrapperService } from '../ip-sec-vpn-wrapper.service';

describe('IpSecVpnWrapperService', () => {
  let service: IpSecVpnWrapperService;

  beforeAll(async () => {
    const { unit } = TestBed.create(IpSecVpnWrapperService).compile();
    service = unit;
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
