import { Module } from '@nestjs/common';
import { TaskManagerService } from './service/task-manager.service';
import { TaskController } from './task.controller';
import { taskFactory } from './taskFactory';
import { Task1Service } from './tasks/increaseVdcResources/task1.service';
import { IncreaseVdcResourceTaskService } from './tasks/increaseVdcResources/increaseVdcResourceTask.service';
import { BullModule } from '@nestjs/bullmq';
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'newTasks',
    }),
    BullModule.registerFlowProducer({
      name: 'newTasksFlowProducer',
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
