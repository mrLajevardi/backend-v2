import { Test, TestingModule } from '@nestjs/testing';
import { VmCreateWrapperService } from './vm-create-wrapper.service';
import { VcloudWrapperModule } from 'src/wrappers/vcloud-wrapper/vcloud-wrapper.module';
import { VdcWrapperService } from '../vdc/vdc-wrapper.service';
import { AdminOrgWrapperService } from '../../admin/org/admin-org-wrapper.service';

describe('VmCreateWrapperService', () => {
  let service: VmCreateWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [VcloudWrapperModule],
      providers: [
        VmCreateWrapperService,
        VdcWrapperService,
        AdminOrgWrapperService,
      ],
    }).compile();

    service = module.get<VmCreateWrapperService>(VmCreateWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
