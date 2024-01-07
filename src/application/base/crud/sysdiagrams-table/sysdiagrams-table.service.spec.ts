import { SysdiagramsTableService } from './sysdiagrams-table.service';
import { TestBed } from '@automock/jest';

describe('sysdiagramsTableService', () => {
  let service: SysdiagramsTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(SysdiagramsTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
