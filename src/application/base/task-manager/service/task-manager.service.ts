import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { TaskInterface } from '../interface/task.interface';
import { Task1Service } from '../tasks/increaseVdcResources/task1.service';
import { TasksSchemaInterface } from '../interface/tasks-schema.interface';
import {
  InjectQueue,
  Processor,
  InjectFlowProducer,
  WorkerHost,
} from '@nestjs/bullmq';
import { FlowJob, FlowProducer, Job, Queue } from 'bullmq';
import { TasksTableService } from '../../crud/tasks-table/tasks-table.service';
import { TasksConfigsInterface } from '../interface/tasks-configs.interface';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { Tasks } from 'src/infrastructure/database/entities/Tasks';

@Processor('newTask', {
  concurrency: 50,
})
export class TaskManagerService extends WorkerHost {
  constructor(
    @InjectQueue('newTasks')
    private taskQueue: Queue,
    @Inject('TASK_MANAGER_TASKS')
    private taskManagerTasks: TasksSchemaInterface,
    @InjectFlowProducer('newTasksFlowProducer')
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
    const targetTask: TasksConfigsInterface =
      this.taskManagerTasks[task.operation];
    const steps: TaskInterface[] = targetTask.steps;
    // console.log(
    //   steps.indexOf(task.currentStep),
    //   task.CurrentStep,
    //   steps.indexOf(job.name),
    //   job.name,
    // );
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
    const targetStep: TaskInterface = steps[currentJobIndex];
    await targetStep.execute(job);
    return;
  }

  private async initTask(
    operation,
    serviceInstanceId,
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
    const steps: TaskInterface[] = this.newTaskFlowProducer[operation].steps;
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
      currentStep: steps[steps.length - 1].stepName,
    });
    return task;
  }

  async createFlow(
    taskName: string,
    serviceInstanceId: string,
    args: Record<string, never> | null = null,
    options = {},
  ): Promise<Tasks> {
    const task = await this.initTask(taskName, serviceInstanceId, args);
    const { taskId } = task;
    const flowProducer = new FlowProducer();
    const queueName = 'newTasks';
    const targetTaskConfig: TasksConfigsInterface =
      this.taskManagerTasks[taskName];
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
        name: step,
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
    await flowProducer.add(flow);
    return task;
  }
}
