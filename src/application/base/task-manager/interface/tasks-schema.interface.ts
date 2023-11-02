import { TasksConfig } from './tasks-configs.interface';

export interface TasksSchema {
  [key: string]: TasksConfig<string>;
}
