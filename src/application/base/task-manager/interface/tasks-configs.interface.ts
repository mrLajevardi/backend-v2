import { TasksEnum } from '../enum/tasks.enum';
import { BaseTask } from './base-task.interface';

export interface TasksConfig<T extends string> {
  taskName: TasksEnum;
  steps: BaseTask<T>[];
}
