import { Tasks } from 'src/infrastructure/database/entities/Tasks';

export interface TaskManagerOptions {
  reuseTask: boolean;
  task: Tasks;
}
