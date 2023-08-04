import { Test, TestingModule } from '@nestjs/testing';
import { TaskAdminController } from './task-admin.controller';

describe('TaskAdminController', () => {
  let controller: TaskAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskAdminController],
    }).compile();

    controller = module.get<TaskAdminController>(TaskAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
