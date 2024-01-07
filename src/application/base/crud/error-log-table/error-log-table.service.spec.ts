import { ErrorLogTableService } from './error-log-table.service';
import { TestBed } from '@automock/jest';

describe('ErrorLogTableService', () => {
  let service: ErrorLogTableService;

  beforeAll(async () => {
    const { unit } = TestBed.create(ErrorLogTableService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
