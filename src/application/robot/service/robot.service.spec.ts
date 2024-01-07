import { RobotService } from './robot.service';
import { TestBed } from '@automock/jest';

describe('RobotService', () => {
  let service: RobotService;

  beforeAll(async () => {
    const { unit } = TestBed.create(RobotService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
