import { Inject, InternalServerErrorException } from '@nestjs/common';
import {
  InjectQueue,
  Processor,
  InjectFlowProducer,
  WorkerHost,
} from '@nestjs/bullmq';
import { FlowJob, FlowProducer, Job, Queue } from 'bullmq';
import { TasksTableService } from '../../crud/tasks-table/tasks-table.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { Tasks } from 'src/infrastructure/database/entities/Tasks';
import { TasksEnum } from '../enum/tasks.enum';
import { TasksSchema } from '../interface/tasks-schema.interface';
import { FlowProducers, QueueNames } from '../enum/queue-names.enum';

@Processor('newTask', {
  concurrency: 50,
})
export class TaskManagerService extends WorkerHost {
  constructor(
    @InjectQueue(QueueNames.NewTaskManager)
    public taskQueue: Queue,
    @Inject('TASK_MANAGER_TASKS')
    public taskManagerTasks: TasksSchema,
    @InjectFlowProducer(FlowProducers.NewTaskManagerFlow)
    private newTaskFlowProducer: FlowProducer,
    private readonly tasksTableService: TasksTableService,
    private readonly serviceInstanceTableService: ServiceInstancesTableService,
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    const task = await this.tasksTableService.findById(job.data.taskId);
    if (!task) {
      throw new InternalServerErrorException();
    }
    if (task.status === 'success' || job.data.type !== 'step') {
      return;
    }
    const targetTask = this.taskManagerTasks[task.operation];
    const steps = targetTask.steps;
    let currentStepIndex: number;
    let currentJobIndex: number;
    for (const step of steps) {
      if (currentStepIndex && currentJobIndex) {
        break;
      }
      if (step.stepName === task.currentStep) {
        currentStepIndex = steps.indexOf(step);
      }
      if (step.stepName === job.name) {
        currentJobIndex = steps.indexOf(step);
      }
    }
    if (currentStepIndex < currentJobIndex) {
      return;
    }
    await steps[currentJobIndex].execute(job);
    return;
  }

  private async initTask(
    operation: TasksEnum,
    serviceInstanceId: string,
    args = null,
  ): Promise<Tasks> {
    if (!serviceInstanceId) {
      throw new InternalServerErrorException();
    }
    const service = await this.serviceInstanceTableService.findById(
      serviceInstanceId,
    );
    const taskFound = this.taskManagerTasks[operation];
    if (!service || !taskFound) {
      throw new InternalServerErrorException();
    }
    const task = await this.tasksTableService.create({
      userId: service.userId,
      serviceInstanceId: serviceInstanceId,
      operation: operation,
      details: null,
      startTime: new Date(),
      endTime: null,
      status: 'running',
      arguments: args,
      stepCounts: 0,
      currentStep: taskFound.steps[taskFound.steps.length - 1].stepName,
    });
    return task;
  }

  async createFlow(
    taskName: TasksEnum,
    serviceInstanceId: string,
    args: Record<string, never> | null = null,
    options = {},
  ): Promise<Tasks> {
    const task = await this.initTask(taskName, serviceInstanceId, args);
    const { taskId } = task;
    const queueName = QueueNames.NewTaskManager;
    const targetTaskConfig = this.taskManagerTasks[taskName];
    const flow: FlowJob = {
      name: taskName,
      data: {
        type: 'task',
        taskId,
      },
      queueName,
    };
    let lastChildRef: FlowJob = flow;
    for (const step in targetTaskConfig.steps) {
      const lastChild = {
        name: targetTaskConfig.steps[step].stepName,
        queueName,
        data: {
          type: 'step',
          taskId,
          serviceInstanceId,
          parent: taskName,
          options,
        },
      };
      lastChildRef.children = [lastChild];
      lastChildRef = lastChild;
    }
    await this.newTaskFlowProducer.add(flow);
    return task;
  }
}
