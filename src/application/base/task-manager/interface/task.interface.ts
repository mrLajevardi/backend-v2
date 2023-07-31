export interface TaskInterface {
  stepName: string;
  execute(): any;
  [key: string]: any;
}
