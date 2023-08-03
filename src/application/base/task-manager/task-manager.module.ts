import { Module } from '@nestjs/common';
import { TaskManagerService } from './service/task-manager.service';
import { BullModule } from '@nestjs/bull';
import { TaskController } from './task.controller';
import { taskFactory } from './taskFactory';
import { Task1Service } from './tasks/increaseVdcResources/task1.service';
import { IncreaseVdcResourceTaskService } from './tasks/increaseVdcResources/increaseVdcResourceTask.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'test',
    }),
  ],
  controllers: [TaskController],
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
