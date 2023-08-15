import { Module } from '@nestjs/common';
import { TaskManagerService } from './service/task-manager.service';
import { taskFactory } from './taskFactory';
import { Task1Service } from './tasks/increaseVdcResources/task1.service';
import { IncreaseVdcResourceTaskService } from './tasks/increaseVdcResources/increaseVdcResourceTask.service';
import { BullModule } from '@nestjs/bullmq';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';
@Module({
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
})
export class TaskManagerModule {}
