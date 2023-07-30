import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Injectable, Inject } from '@nestjs/common';
import { Queue } from 'bull';

@Processor('test')
export class TaskManagerService {
    constructor(
        @InjectQueue('test')
        private taskQueue: Queue,
        @Inject('TASKS')
        private readonly tasks: any,
    ) {}

    @Process()
    async processTask(job, done){
        console.log('hello')
        console.log(this.tasks)
        this.tasks.sayHello()
        done()
    }

    async addTask(task) {
        console.log("hello1")
        await this.taskQueue.add(task);
    }
}
