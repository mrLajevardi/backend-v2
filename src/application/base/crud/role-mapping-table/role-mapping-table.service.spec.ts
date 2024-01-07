import { RoleMappingTableService } from './role-mapping-table.service';
import { TestBed } from '@automock/jest';

describe('RoleMappingTableService', () => {
  let service: RoleMappingTableService;
  beforeAll(async () => {
    const { unit } = TestBed.create(RoleMappingTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
