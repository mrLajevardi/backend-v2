import { Injectable, Provider } from '@nestjs/common';
import { TasksConfigsInterface } from '../../interface/tasks-configs.interface';
import { Task1Service } from './task1.service';

const configs: TasksConfigsInterface = {
  taskName: 'increaseVdcResource',
  steps: [Task1Service],
};

// @Injectable()
// export class ConfigService implements TasksConfigsInterface {
//   steps: any[];
//   taskName: string;
//   constructor(private task1Service: Task1Service) {
//     this.steps = [this.task1Service];
//   }
// }
export default configs;
