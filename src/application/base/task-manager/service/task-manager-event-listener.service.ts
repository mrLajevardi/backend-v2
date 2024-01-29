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
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { ServiceStatusEnum } from '../../service/enum/service-status.enum';
import { TasksEnum } from '../enum/tasks.enum';

@QueueEventsListener(QueueNames.NewTaskManager)
export class TaskManagerEventListenerService extends QueueEventsHost {
  constructor(
    private readonly taskManagerService: TaskManagerService,
    private readonly tasksTableService: TasksTableService,
    private readonly serviceInstanceTableService: ServiceInstancesTableService,
  ) {
    super();
  }

  @OnQueueEvent('failed')
  async onFailed(job: FailedJob): Promise<void> {
    const jobDetails: Job<TaskDataType> =
      await this.taskManagerService.taskQueue.getJob(job.jobId);
    await this.tasksTableService.update(jobDetails.data.taskId, {
      status: TasksStatusEnum.Error,
      details: job.failedReason,
      endTime: new Date(),
    });

    if (jobDetails.data.parent === TasksEnum.UpgradeVdc) {
      return this.upgradeVdcOnErrorAndFailure(
        jobDetails.data.serviceInstanceId,
      );
    }
  }

  @OnQueueEvent('error')
  async onError(job: CompletedJob, err: Error): Promise<void> {
    const jobDetails: Job<TaskDataType> =
      await this.taskManagerService.taskQueue.getJob(job.jobId);
    await this.tasksTableService.update(jobDetails.data.taskId, {
      status: TasksStatusEnum.Error,
      details: 'internal task error',
      endTime: new Date(),
    });

    if (jobDetails.data.parent === TasksEnum.UpgradeVdc) {
      return this.upgradeVdcOnErrorAndFailure(
        jobDetails.data.serviceInstanceId,
      );
    }
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
        endTime: new Date(),
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

  private async upgradeVdcOnErrorAndFailure(
    serviceInstanceId: string,
  ): Promise<void> {
    console.log(`upgrading service [${serviceInstanceId}] has been failed`);
    await this.serviceInstanceTableService.update(serviceInstanceId, {
      status: ServiceStatusEnum.Error,
    });
  }
}
