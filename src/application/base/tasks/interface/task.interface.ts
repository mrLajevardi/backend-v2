import { Tasks } from 'src/infrastructure/database/entities/Tasks';

export interface iTask {
  serviceInstanceId: number;
  customTaskId: number;
  vcloudTask: Tasks;
  target: string;
  nextTask: string;
  taskType?: string;
  requestOptions: any;
}
