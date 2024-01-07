import { SettingTableService } from './setting-table.service';
import { TestBed } from '@automock/jest';

describe('SettingTableService', () => {
  let service: SettingTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(SettingTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
