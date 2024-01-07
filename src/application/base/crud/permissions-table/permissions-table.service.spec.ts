import { PermissionsTableService } from './permissions-table.service';
import { TestBed } from '@automock/jest';

describe('PermissionsTableService', () => {
  let service: PermissionsTableService;
  beforeAll(async () => {
    const { unit } = TestBed.create(PermissionsTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
