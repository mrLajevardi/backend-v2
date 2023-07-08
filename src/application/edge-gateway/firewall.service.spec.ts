import { Test, TestingModule } from '@nestjs/testing';
import { FirewallService } from './firewall.service';

describe('FirewallService', () => {
  let service: FirewallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirewallService],
    }).compile();

    service = module.get<FirewallService>(FirewallService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
