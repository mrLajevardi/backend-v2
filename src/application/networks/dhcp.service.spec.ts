import { Test, TestingModule } from '@nestjs/testing';
import { DhcpService } from './dhcp.service';

describe('DhcpService', () => {
  let service: DhcpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DhcpService],
    }).compile();

    service = module.get<DhcpService>(DhcpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
