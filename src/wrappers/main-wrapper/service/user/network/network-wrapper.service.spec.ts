import { Test, TestingModule } from '@nestjs/testing';
import { NetworkWrapperService } from './network-wrapper.service';

describe('NetworkWrapperService', () => {
  let service: NetworkWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NetworkWrapperService],
    }).compile();

    service = module.get<NetworkWrapperService>(NetworkWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
