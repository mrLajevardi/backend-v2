export class TaskRunnerDto {
  taskType: string;
  serviceInstanceId: string;
  customTaskId: string;
  vcloudTask: object;
  target: string;
  nextTask: string;
  requestOptions: object;
}
