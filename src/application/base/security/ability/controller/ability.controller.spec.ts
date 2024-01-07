import { AbilityController } from './ability.controller';
import { TestBed } from '@automock/jest';

describe('AbilityController', () => {
  let controller: AbilityController;

  beforeAll(async () => {
    const { unit } = TestBed.create(AbilityController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
