import { Module } from '@nestjs/common';
import { TaskManagerService } from './service/task-manager.service';
import { BullModule } from '@nestjs/bull';
import { TaskController } from './task.controller';
import { ConfigModule } from '@nestjs/config';
import { initServices } from './taskFactory';
import { Task1Service } from './tasks/increaseVdcResources/task1.service';

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
      provide: 'Tasks',
      useFactory: initServices,
      inject: [Task1Service],
    },
    Task1Service,
  ],
})
export class TaskManagerModule {}
