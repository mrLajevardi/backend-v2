import { AdminUserWrapperService } from './admin-user-wrapper.service';
import { TestBed } from '@automock/jest';

describe('AdminUserWrapperService', () => {
  let service: AdminUserWrapperService;

  beforeAll(async () => {
    const { unit } = TestBed.create(AdminUserWrapperService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
