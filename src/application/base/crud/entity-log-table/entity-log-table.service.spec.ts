import { EntityLogTableService } from './entity-log-table.service';
import { TestBed } from '@automock/jest';

describe('EntityLogTableService', () => {
  let service: EntityLogTableService;

  beforeEach(async () => {
    const { unit } = TestBed.create(EntityLogTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
