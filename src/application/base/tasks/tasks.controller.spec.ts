import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TasksService } from './service/tasks.service';

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [TasksService],
      controllers: [TasksController],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
