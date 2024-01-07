import { AitransactionsLogsStoredProcedureService } from './aitransactions-logs-stored-procedure.service';
import { TestBed } from '@automock/jest';

describe('AitransactionsLogsStoredProcedureService', () => {
  let service: AitransactionsLogsStoredProcedureService;

  beforeEach(async () => {
    const { unit } = TestBed.create(
      AitransactionsLogsStoredProcedureService,
    ).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
