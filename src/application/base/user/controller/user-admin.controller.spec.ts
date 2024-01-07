import { UserAdminController } from './user-admin.controller';
import { TestBed } from '@automock/jest';

describe('UserAdminController', () => {
  let controller: UserAdminController;

  beforeAll(async () => {
    const { unit } = TestBed.create(UserAdminController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
