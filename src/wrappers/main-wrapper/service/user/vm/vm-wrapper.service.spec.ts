import { Test, TestingModule } from '@nestjs/testing';
import { VmWrapperService } from './vm-wrapper.service';
import { VcloudWrapperModule } from 'src/wrappers/vcloud-wrapper/vcloud-wrapper.module';
import { VdcWrapperService } from '../vdc/vdc-wrapper.service';

describe('VmWrapperService', () => {
  let service: VmWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [VcloudWrapperModule],
      providers: [VmWrapperService, VdcWrapperService],
    }).compile();

    service = module.get<VmWrapperService>(VmWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
