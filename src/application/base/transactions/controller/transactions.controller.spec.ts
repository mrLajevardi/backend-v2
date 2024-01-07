import { TransactionsController } from './transactions.controller';
import { TestBed } from '@automock/jest';

describe('TransactionsController', () => {
  let controller: TransactionsController;

  beforeAll(async () => {
    const { unit } = TestBed.create(TransactionsController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
