import { PermissionGroupsMappingsTableService } from './permission-groups-mappings-table.service';
import { TestBed } from '@automock/jest';

describe('PermissionGroupsMappingsTableService', () => {
  let service: PermissionGroupsMappingsTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(
      PermissionGroupsMappingsTableService,
    ).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
