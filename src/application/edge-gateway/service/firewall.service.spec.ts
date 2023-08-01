import { Test, TestingModule } from '@nestjs/testing';
import { FirewallService } from './firewall.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('FirewallService', () => {
  let service: FirewallService;

  beforeEach(async () => {
    module =  Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [FirewallService],
    }).compile();

    service = module.get<FirewallService>(FirewallService);
  });

  afterAll(async () => { await module.close(); });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
