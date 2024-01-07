import { RobotController } from './robot.controller';
import { TestBed } from '@automock/jest';

describe('RobotController', () => {
  let controller: RobotController;

  beforeAll(async () => {
    const { unit } = TestBed.create(RobotController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
