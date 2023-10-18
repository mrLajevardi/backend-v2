import { Job } from 'bullmq';

export interface BaseTask<T extends string> {
  stepName: T;
  execute(job: Job): any;
}
