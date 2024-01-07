import { NatController } from './nat.controller';
import { TestBed } from '@automock/jest';

describe('NatController', () => {
  let controller: NatController;

  beforeAll(async () => {
    const { unit } = TestBed.create(NatController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
