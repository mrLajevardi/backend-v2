import { TasksController } from './tasks.controller';
import { TestBed } from '@automock/jest';

describe('TasksController', () => {
  let controller: TasksController;

  beforeAll(async () => {
    const { unit } = TestBed.create(TasksController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
