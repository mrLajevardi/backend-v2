import { Test, TestingModule } from '@nestjs/testing';
import { VmUpdateWrapperService } from './vm-update-wrapper.service';

describe('VmUpdateWrapperService', () => {
  let service: VmUpdateWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VmUpdateWrapperService],
    }).compile();

    service = module.get<VmUpdateWrapperService>(VmUpdateWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
