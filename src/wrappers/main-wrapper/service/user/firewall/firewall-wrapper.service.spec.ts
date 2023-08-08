import { Test, TestingModule } from '@nestjs/testing';
import { FirewallWrapperService } from './firewall-wrapper.service';

describe('FirewallWrapperService', () => {
  let service: FirewallWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirewallWrapperService],
    }).compile();

    service = module.get<FirewallWrapperService>(FirewallWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
