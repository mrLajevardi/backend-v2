import { GroupsTableService } from './groups-table.service';
import { TestBed } from '@automock/jest';

describe('GroupsTableService', () => {
  let service: GroupsTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(GroupsTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
