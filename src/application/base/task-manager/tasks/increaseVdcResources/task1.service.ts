import { Injectable } from '@nestjs/common';
import { TaskInterface } from '../../interface/task.interface';
import { Job } from 'bullmq';
@Injectable()
export class Task1Service implements TaskInterface {
  stepName: 'task1';
  execute(job: Job) {
    return true;
  }
}
