import { Test, TestingModule } from '@nestjs/testing';
import { VmCreateWrapperService } from './vm-create-wrapper.service';

describe('VmCreateWrapperService', () => {
  let service: VmCreateWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VmCreateWrapperService],
    }).compile();

    service = module.get<VmCreateWrapperService>(VmCreateWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
