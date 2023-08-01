import { Test, TestingModule } from '@nestjs/testing';
import { DhcpService } from './dhcp.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('DhcpService', () => {
  let service: DhcpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [DhcpService],
    }).compile();

    service = module.get<DhcpService>(DhcpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
