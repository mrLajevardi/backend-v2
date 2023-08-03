import { TasksConfigsInterface } from './interface/tasks-configs.interface';
import { TasksSchemaInterface } from './interface/tasks-schema.interface';

export function taskFactory(...tasks: TasksConfigsInterface[]) {
  const tasksSchema: TasksSchemaInterface | Record<string, never> = {};
  for (const task of tasks) {
    tasksSchema[task.taskName] = task;
  }
  return tasksSchema;
}
