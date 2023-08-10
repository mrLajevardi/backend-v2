import { Test, TestingModule } from '@nestjs/testing';
import { AdminOrgWrapperService } from './admin-org-wrapper.service';

describe('AdminOrgWrapperService', () => {
  let service: AdminOrgWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminOrgWrapperService],
    }).compile();

    service = module.get<AdminOrgWrapperService>(AdminOrgWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
