import { Module } from '@nestjs/common';
import { TasksService } from './service/tasks.service';
import { TasksController } from './tasks.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TaskQueueService } from './service/task-queue.service';
import { BullModule } from '@nestjs/bull';
import { TaskManagerService } from './service/task-manager.service';

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({
      name: 'tasks',
    })
  ],
  providers: [TasksService, TaskQueueService, TaskManagerService],
  controllers: [TasksController],
  exports: [TasksService],

})
export class TasksModule {}
