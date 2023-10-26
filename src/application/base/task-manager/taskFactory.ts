import { TasksConfig } from './interface/tasks-configs.interface';
import { TasksSchema } from './interface/tasks-schema.interface';

export function taskFactory(...tasks: TasksConfig<string>[]): TasksSchema {
  const tasksSchema: TasksSchema | Record<string, never> = {};
  for (const task of tasks) {
    tasksSchema[task.taskName] = task;
  }
  return tasksSchema;
}
