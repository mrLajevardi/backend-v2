import { Test, TestingModule } from '@nestjs/testing';
import { TaskManagerService } from './task-manager.service';
import { BullModule } from '@nestjs/bullmq';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../../crud/crud.module';
import { taskFactory } from '../taskFactory';
import { IncreaseVdcResourceTaskService } from '../tasks/increaseVdcResources/increaseVdcResourceTask.service';
import { Task1Service } from '../tasks/increaseVdcResources/task1.service';

describe('TaskManagerService', () => {
  let service: TaskManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BullModule.registerQueue({
          name: 'newTasks',
        }),
        BullModule.registerFlowProducer({
          name: 'newTasksFlowProducer',
        }),
        DatabaseModule,
        CrudModule,
      ],
      providers: [
        TaskManagerService,
        {
          provide: 'TASK_MANAGER_TASKS',
          useFactory: taskFactory,
          inject: [IncreaseVdcResourceTaskService],
        },
        Task1Service,
        IncreaseVdcResourceTaskService,
      ],
    }).compile();

    service = module.get<TaskManagerService>(TaskManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
