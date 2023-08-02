import { TasksConfigsInterface } from '../../interface/tasks-configs.interface';
import { Task1Service } from './task1.service';

const configs: TasksConfigsInterface = {
  taskName: 'increaseVdcResource',
  steps: [Task1Service],
};

export default configs;
