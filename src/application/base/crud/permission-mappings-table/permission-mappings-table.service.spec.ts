import { PermissionMappingsTableService } from './permission-mappings-table.service';
import { TestBed } from '@automock/jest';

describe('PermissionMappingsTableService', () => {
  let service: PermissionMappingsTableService;
  beforeAll(async () => {
    const { unit } = TestBed.create(PermissionMappingsTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
