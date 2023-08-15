import { Test, TestingModule } from '@nestjs/testing';
import { VmGetWrapperService } from './vm-get-wrapper.service';
import { VcloudWrapperModule } from 'src/wrappers/vcloud-wrapper/vcloud-wrapper.module';

describe('VmGetWrapperService', () => {
  let service: VmGetWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [VcloudWrapperModule],
      providers: [VmGetWrapperService],
    }).compile();

    service = module.get<VmGetWrapperService>(VmGetWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
