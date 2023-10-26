import { QueueEventsHost, QueueEventsListener } from '@nestjs/bullmq';
import { QueueNames } from '../enum/queue-names.enum';
import { OnQueueEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TaskManagerService } from './task-manager.service';
import { CompletedJob } from '../interface/completed-job.interface';
import { TasksTableService } from '../../crud/tasks-table/tasks-table.service';
import { TaskDataType } from '../interface/task-data-type.interface';
import { JobTypesEnum } from '../enum/job-types.enum';
import { TasksStatusEnum } from '../../tasks/enum/tasks-status.enum';
import { FailedJob } from '../interface/failed-job.interface';

@QueueEventsListener(QueueNames.NewTaskManager)
export class TaskManagerEventListenerService extends QueueEventsHost {
  constructor(
    private readonly taskManagerService: TaskManagerService,
    private readonly tasksTableService: TasksTableService,
  ) {
    super();
  }
  @OnQueueEvent('failed')
  async onFailed(job: FailedJob): Promise<void> {
    const jobDetails: Job<TaskDataType> =
      await this.taskManagerService.taskQueue.getJob(job.jobId);
    await this.tasksTableService.update(jobDetails.data.taskId, {
      status: TasksStatusEnum.Error,
    });
  }

  @OnQueueEvent('error')
  onError(job: CompletedJob, err: Error) {
    console.log(err, job);
  }
  @OnQueueEvent('completed')
  async onSuccess(job: CompletedJob): Promise<void> {
    const jobDetails: Job<TaskDataType> =
      await this.taskManagerService.taskQueue.getJob(job.jobId);
    const {
      data: { taskId, type, parent },
      name,
    } = jobDetails;
    const task = await this.tasksTableService.findById(taskId);
    if (type === JobTypesEnum.task) {
      await this.tasksTableService.update(taskId, {
        status: TasksStatusEnum.Success,
      });
    } else {
      const currentStep = this.taskManagerService.taskManagerTasks[
        parent
      ].steps.findIndex((step) => step.stepName === name);
      await this.tasksTableService.update(taskId, {
        stepCounts: task.stepCounts + 1,
        currentStep:
          this.taskManagerService.taskManagerTasks[parent].steps[currentStep]
            .stepName,
      });
    }
  }
}
