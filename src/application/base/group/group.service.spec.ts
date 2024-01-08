import { GroupService } from './group.service';
import { TestBed } from '@automock/jest';

describe('GroupService', () => {
  let service: GroupService;

  beforeAll(async () => {
    const { unit } = TestBed.create(GroupService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
