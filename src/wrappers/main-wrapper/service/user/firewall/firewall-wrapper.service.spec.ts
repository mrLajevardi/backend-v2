import { FirewallWrapperService } from './firewall-wrapper.service';
import { TestBed } from '@automock/jest';

describe('FirewallWrapperService', () => {
  let service: FirewallWrapperService;

  beforeAll(async () => {
    const { unit } = TestBed.create(FirewallWrapperService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
