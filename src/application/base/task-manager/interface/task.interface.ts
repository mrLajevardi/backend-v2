import { Job } from 'bullmq';

export interface TaskInterface {
  stepName: string;
  execute(job: Job): any;
  [key: string]: any;
}
