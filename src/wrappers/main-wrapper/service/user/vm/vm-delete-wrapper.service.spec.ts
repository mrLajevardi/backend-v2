import { Test, TestingModule } from '@nestjs/testing';
import { VmDeleteWrapperService } from './vm-delete-wrapper.service';

describe('VmDeleteWrapperService', () => {
  let service: VmDeleteWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VmDeleteWrapperService],
    }).compile();

    service = module.get<VmDeleteWrapperService>(VmDeleteWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
