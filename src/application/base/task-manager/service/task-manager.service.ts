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
    @Inject('Tasks')
    private taskManage: Array<any>,
  ) {}

  @Process()
  async processTask(job, done) {
    console.log(this.taskManage);
    console.log('hello');
    done();
  }

  async addTask(task) {
    console.log('hello1');
    await this.taskQueue.add(task);
  }
}
