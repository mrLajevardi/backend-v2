import { InfoLogTableService } from './info-log-table.service';
import { TestBed } from '@automock/jest';

describe('InfoLogTableService', () => {
  let service: InfoLogTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(InfoLogTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
