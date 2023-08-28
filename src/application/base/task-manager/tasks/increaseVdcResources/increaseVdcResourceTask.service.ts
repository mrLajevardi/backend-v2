import { Injectable } from '@nestjs/common';
import { TaskInterface } from '../../interface/task.interface';
import { Task1Service } from './task1.service';
import { TasksConfigsInterface } from '../../interface/tasks-configs.interface';
@Injectable()
export class IncreaseVdcResourceTaskService implements TasksConfigsInterface {
  steps: any[];
  taskName: string;
  constructor(private readonly task1Service: Task1Service) {
    this.steps = [this.task1Service];
    this.taskName = 'increaseVdcResource';
  }
}
