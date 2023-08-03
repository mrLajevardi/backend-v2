import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Injectable, Inject } from '@nestjs/common';
import { Queue } from 'bull';
import { TaskInterface } from '../interface/task.interface';
import { Task1Service } from '../tasks/increaseVdcResources/task1.service';
import { TasksSchemaInterface } from '../interface/tasks-schema.interface';

@Processor('test')
export class TaskManagerService {
  constructor(
    @InjectQueue('test')
    private taskQueue: Queue,
    private Task1: Task1Service,
    @Inject('TASK_MANAGER_TASKS')
    private taskManagerTasks: TasksSchemaInterface,
  ) {}

  @Process()
  async processTask(job, done) {
    console.dir(this.taskManagerTasks, { depth: null });
    console.log('hello');
    console.log(this.Task1);
    done();
  }

  async addTask(task) {
    console.log('hello1');
    await this.taskQueue.add(task);
  }
}
