import { DhcpService } from './dhcp.service';
import { TestBed } from '@automock/jest';

describe('DhcpService', () => {
  let service: DhcpService;

  beforeAll(async () => {
    const { unit } = TestBed.create(DhcpService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
