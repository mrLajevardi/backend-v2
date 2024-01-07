import { BudgetingController } from './budgeting.controller';
import { TestBed } from '@automock/jest';

describe('BudgetingController', () => {
  let controller: BudgetingController;

  beforeEach(async () => {
    const { unit } = TestBed.create(BudgetingController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
