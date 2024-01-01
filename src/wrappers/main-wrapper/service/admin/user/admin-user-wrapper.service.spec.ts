import { Test, TestingModule } from '@nestjs/testing';
import { AdminUserWrapperService } from './admin-user-wrapper.service';
import { VcloudWrapperModule } from 'src/wrappers/vcloud-wrapper/vcloud-wrapper.module';

describe('AdminUserWrapperService', () => {
  let service: AdminUserWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [VcloudWrapperModule],
      providers: [AdminUserWrapperService],
    }).compile();

    service = module.get<AdminUserWrapperService>(AdminUserWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
