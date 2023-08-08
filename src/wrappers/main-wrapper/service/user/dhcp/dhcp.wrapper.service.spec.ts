import { Test, TestingModule } from '@nestjs/testing';
import { DhcpWrapperService } from './dhcp-wrapper.service';

describe('DhcpService', () => {
  let service: DhcpWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DhcpWrapperService],
    }).compile();

    service = module.get<DhcpWrapperService>(DhcpWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
