import { FirewallService } from './firewall.service';
import { TestBed } from '@automock/jest';

describe('FirewallService', () => {
  let service: FirewallService;

  beforeAll(async () => {
    const { unit } = TestBed.create(FirewallService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
