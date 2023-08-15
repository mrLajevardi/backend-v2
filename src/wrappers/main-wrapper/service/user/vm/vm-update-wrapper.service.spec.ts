import { Test, TestingModule } from '@nestjs/testing';
import { VmUpdateWrapperService } from './vm-update-wrapper.service';
import { VcloudWrapperModule } from 'src/wrappers/vcloud-wrapper/vcloud-wrapper.module';
import { VdcWrapperService } from '../vdc/vdc-wrapper.service';
import { VmGetWrapperService } from './vm-get-wrapper.service';

describe('VmUpdateWrapperService', () => {
  let service: VmUpdateWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [VcloudWrapperModule],
      providers: [
        VmUpdateWrapperService,
        VdcWrapperService,
        VmGetWrapperService,
      ],
    }).compile();

    service = module.get<VmUpdateWrapperService>(VmUpdateWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
