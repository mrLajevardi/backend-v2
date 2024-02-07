import { UserAdminService } from './user-admin.service';
import { TestBed } from '@automock/jest';

describe('UserAdminService', () => {
  let service: UserAdminService;

  beforeAll(async () => {
    const { unit } = TestBed.create(UserAdminService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
