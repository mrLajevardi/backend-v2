import { Test, TestingModule } from '@nestjs/testing';
import { FirewallService } from './firewall.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('FirewallService', () => {
  let service: FirewallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [FirewallService],
    }).compile();

    service = module.get<FirewallService>(FirewallService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
