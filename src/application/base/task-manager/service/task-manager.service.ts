import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Injectable, Inject } from '@nestjs/common';
import { Queue } from 'bull';
import { TaskInterface } from '../interface/task.interface';
import { Task1Service } from '../tasks/increaseVdcResources/task1.service';

@Processor('test')
export class TaskManagerService {
  constructor(
    @InjectQueue('test')
    private taskQueue: Queue,
    @Inject('TASKS')
    private readonly tasks: any,
    private 
  ) {}

  @Process()
  async processTask(job, done) {
    const t: Array<TaskInterface> = [Task1Service];
    console.log('hello');
    console.log(this.tasks);
    this.tasks.sayHello();
    done();
  }

  async addTask(task) {
    console.log('hello1');
    await this.taskQueue.add(task);
  }
}
