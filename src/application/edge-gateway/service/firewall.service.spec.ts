import { Test, TestingModule } from '@nestjs/testing';
import { FirewallService } from './firewall.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('FirewallService', () => {
  let service: FirewallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [FirewallService],
    }).compile();

    service = module.get<FirewallService>(FirewallService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
