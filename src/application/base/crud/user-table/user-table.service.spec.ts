import { UserTableService } from './user-table.service';
import { TestBed } from '@automock/jest';

describe('UserTableService', () => {
  let service: UserTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(UserTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
