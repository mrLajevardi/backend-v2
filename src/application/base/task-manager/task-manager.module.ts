import { Module } from '@nestjs/common';
import { TaskManagerService } from './service/task-manager.service';
import { Task1Service } from './tasks/task1.service';
import { Task2Service } from './tasks/task2.service';
import { BullModule } from '@nestjs/bull';
import { TaskController } from './task.controller';
import { ConfigModule } from '@nestjs/config';

function aut() {
  return [Task1Service, Task2Service];
}
const inj = aut();
console.log(inj);
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'test',
    }),

    ConfigModule.forRoot({
      load
    })
  ],
  controllers: [TaskController],
  providers: [
    TaskManagerService,
    {
      provide: 'TASKS',
      useFactory: (...args): any => {
        console.log(args, ',,');
        return args;
      },
      inject: inj,
    },
    ...inj,
  ],
})
export class TaskManagerModule {}
