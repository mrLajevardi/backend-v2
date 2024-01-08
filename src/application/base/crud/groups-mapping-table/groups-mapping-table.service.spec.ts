import { GroupsMappingTableService } from './groups-mapping-table.service';
import { TestBed } from '@automock/jest';

describe('GroupsMappingTableService', () => {
  let service: GroupsMappingTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(GroupsMappingTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
