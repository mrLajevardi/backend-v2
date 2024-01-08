import { DhcpWrapperService } from './dhcp-wrapper.service';
import { TestBed } from '@automock/jest';

describe('DhcpService', () => {
  let service: DhcpWrapperService;

  beforeAll(async () => {
    const { unit } = TestBed.create(DhcpWrapperService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
