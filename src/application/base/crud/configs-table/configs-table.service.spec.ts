import { ConfigsTableService } from './configs-table.service';
import { TestBed } from '@automock/jest';

describe('ConfigsTableService', () => {
  let service: ConfigsTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(ConfigsTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
