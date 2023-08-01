import { Test, TestingModule } from '@nestjs/testing';
import { DhcpService } from './dhcp.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('DhcpService', () => {
  let service: DhcpService;

  beforeEach(async () => {
    module =  Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [DhcpService],
    }).compile();

    service = module.get<DhcpService>(DhcpService);
  });

  afterAll(async () => { await module.close(); });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
