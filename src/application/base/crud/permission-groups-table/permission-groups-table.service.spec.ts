import { PermissionGroupsTableService } from './permission-groups-table.service';
import { TestBed } from '@automock/jest';

describe('PermissionGroupsTableService', () => {
  let service: PermissionGroupsTableService;
  beforeAll(async () => {
    const { unit } = TestBed.create(PermissionGroupsTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
