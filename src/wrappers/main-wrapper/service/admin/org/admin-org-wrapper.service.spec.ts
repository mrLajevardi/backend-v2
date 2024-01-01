import { Test, TestingModule } from '@nestjs/testing';
import { AdminOrgWrapperService } from './admin-org-wrapper.service';
import { VcloudWrapperModule } from 'src/wrappers/vcloud-wrapper/vcloud-wrapper.module';

describe('AdminOrgWrapperService', () => {
  let service: AdminOrgWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [VcloudWrapperModule],
      providers: [AdminOrgWrapperService],
    }).compile();

    service = module.get<AdminOrgWrapperService>(AdminOrgWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
