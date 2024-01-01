import { Tasks } from 'src/infrastructure/database/entities/Tasks';

export interface iTask {
  serviceInstanceId: string;
  customTaskId: string;
  vcloudTask: Tasks;
  target: string;
  nextTask: string;
  taskType?: string;
  requestOptions: any;
}
