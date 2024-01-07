import { InvoicesController } from './invoices.controller';
import { TestBed } from '@automock/jest';

describe('InvoicesController', () => {
  let controller: InvoicesController;

  beforeAll(async () => {
    const { unit } = TestBed.create(InvoicesController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
