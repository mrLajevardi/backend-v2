import { JobTypesEnum } from '../enum/job-types.enum';
import { TasksEnum } from '../enum/tasks.enum';

export interface TaskDataType {
  type: JobTypesEnum;
  taskId: string;
  parent: TasksEnum;
  serviceInstanceId: string;
  options: any;
}
