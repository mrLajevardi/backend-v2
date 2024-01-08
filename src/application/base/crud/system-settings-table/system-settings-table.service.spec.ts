import { SystemSettingsTableService } from './system-settings-table.service';
import { TestBed } from '@automock/jest';

describe('SystemSettingsTableService', () => {
  let service: SystemSettingsTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(SystemSettingsTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
