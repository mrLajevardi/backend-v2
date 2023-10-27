import { Test, TestingModule } from '@nestjs/testing';
import { TaskManagerService } from './task-manager.service';
import { BullModule } from '@nestjs/bullmq';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../../crud/crud.module';
import { taskFactory } from '../taskFactory';
import { FlowProducers, QueueNames } from '../enum/queue-names.enum';

describe('TaskManagerService', () => {
  let service: TaskManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BullModule.registerQueue({
          name: QueueNames.NewTaskManager,
        }),
        BullModule.registerFlowProducer({
          name: FlowProducers.NewTaskManagerFlow,
        }),
        DatabaseModule,
        CrudModule,
      ],
      providers: [
        TaskManagerService,
        {
          provide: 'TASK_MANAGER_TASKS',
          useFactory: taskFactory,
          inject: [],
        },
      ],
    }).compile();

    service = module.get<TaskManagerService>(TaskManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
