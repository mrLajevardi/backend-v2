import { IpSecVpnController } from './ip-sec-vpn.controller';
import { TestBed } from '@automock/jest';

describe('IpSecVpnController', () => {
  let controller: IpSecVpnController;

  beforeAll(async () => {
    const { unit } = TestBed.create(IpSecVpnController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
