import { Test, TestingModule } from '@nestjs/testing';
import { AdminUserWrapperService } from './admin-user-wrapper.service';

describe('AdminUserWrapperService', () => {
  let service: AdminUserWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminUserWrapperService],
    }).compile();

    service = module.get<AdminUserWrapperService>(AdminUserWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
