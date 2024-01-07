import { RoleTableService } from './role-table.service';
import { TestBed } from '@automock/jest';

describe('RoleTableService', () => {
  let service: RoleTableService;
  beforeAll(async () => {
    const { unit } = TestBed.create(RoleTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
