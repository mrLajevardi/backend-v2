import { Test, TestingModule } from '@nestjs/testing';
import { DhcpService } from './dhcp.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('DhcpService', () => {
  let service: DhcpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [DhcpService],
    }).compile();

    service = module.get<DhcpService>(DhcpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
