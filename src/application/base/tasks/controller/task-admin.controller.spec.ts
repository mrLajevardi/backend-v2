import { TaskAdminController } from './task-admin.controller';
import { TestBed } from '@automock/jest';

describe('TaskAdminController', () => {
  let controller: TaskAdminController;

  beforeAll(async () => {
    const { unit } = TestBed.create(TaskAdminController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
