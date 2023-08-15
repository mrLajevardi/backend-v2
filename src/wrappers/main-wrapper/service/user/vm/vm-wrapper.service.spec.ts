import { Test, TestingModule } from '@nestjs/testing';
import { VmWrapperService } from './vm-wrapper.service';

describe('VmWrapperService', () => {
  let service: VmWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VmWrapperService],
    }).compile();

    service = module.get<VmWrapperService>(VmWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
