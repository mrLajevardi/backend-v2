import { ScopeTableService } from './scope-table.service';
import { TestBed } from '@automock/jest';

describe('ScopeTableService', () => {
  let service: ScopeTableService;
  beforeAll(async () => {
    const { unit } = TestBed.create(ScopeTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
