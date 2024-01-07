import { BudgetingService } from './budgeting.service';
import { TestBed } from '@automock/jest';

describe('BudgetingService', () => {
  let service: BudgetingService;

  beforeEach(async () => {
    const { unit } = TestBed.create(BudgetingService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
