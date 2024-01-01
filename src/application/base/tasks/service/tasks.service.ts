import { ForbiddenException, Injectable } from '@nestjs/common';
import { TasksTableService } from '../../crud/tasks-table/tasks-table.service';
import { SessionsService } from '../../sessions/sessions.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { isEmpty } from 'lodash';
import { ServicePropertiesService } from '../../service-properties/service-properties.service';
import { VcloudErrorException } from 'src/infrastructure/exceptions/vcloud-error.exception';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { GetTasksReturnDto } from '../dto/return/get-tasks-return.dto';
import { OrganizationTableService } from '../../crud/organization-table/organization-table.service';
import { TaskManagerService } from '../../task-manager/service/task-manager.service';
import { TasksEnum } from '../../task-manager/enum/tasks.enum';
import { Tasks } from '../../../../infrastructure/database/entities/Tasks';
import { VmTasksQueryDto } from '../../../vm/dto/vm-tasks.query.dto';
import { TaskFactoryService } from './task.factory.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly taskTable: TasksTableService,
    private readonly sessionService: SessionsService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly organizationTableService: OrganizationTableService,
    private readonly taskManagerService: TaskManagerService,
    private readonly taskFactoryService: TaskFactoryService,
  ) {}

  async getTasksList(
    options: SessionRequest,
    query: VmTasksQueryDto,
  ): Promise<GetTasksReturnDto[] | null> {
    const userId = options.user.userId;
    const org = await this.organizationTableService.findOne({
      where: {
        user: { id: userId },
      },
    });
    if (!org) {
      return [];
    }
    let filter = '';
    filter = this.taskFactoryService.setTaskFilter(query);

    const session = await this.sessionService.checkUserSession(userId, org.id);
    const tasks = await mainWrapper.user.vdc.vcloudQuery(session, {
      type: 'task',
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      sortDesc: 'startDate',
      filter: filter,
      filterEncoded: true,
      format: 'records',
      links: true,
    });
    if (!tasks) {
      throw new VcloudErrorException();
    }
    let data = [];
    for (const task of tasks.data.record) {
      data.push({
        startTime: task.startDate,
        endTime: task.endDate,
        status: task.status,
        id: task.href.split('task/')[1],
        object: task.object?.split('/').slice(-1)[0] || null,
        operation: task.name,
        progress: task.progress,
      });
    }
    if (!query.vmId && !query.vappId) {
      data = await this.getTaskFromTaskTable(data, userId, query);
    }

    return Promise.resolve(data);
  }

  private async getTaskFromTaskTable(
    data: any[],
    userId: number,
    query: VmTasksQueryDto,
  ) {
    const filteredTasksList = ['jobEnable'];
    data = data.filter((data) => {
      return !filteredTasksList.includes(data.operation);
    });
    const customTasks = await this.taskTable.find({
      where: {
        userId,
      },
      take: 10,
      order: {
        startTime: 'DESC',
      },
    });
    for (const task of customTasks) {
      data.push({
        startTime: task.startTime,
        endTime: task.endTime,
        status: task.status,
        id: task.taskId,
        object: null,
        operation: task.operation,
      });
    }

    data.sort(function (task1, task2) {
      const task1Date = new Date(task1.startTime).getTime();
      const task2Date = new Date(task2.startTime).getTime();
      if (task1Date > task2Date) {
        return -1;
      } else if (task1Date < task2Date) {
        return 1;
      } else {
        return 0;
      }
    });

    return data.slice(0, query.pageSize);
  }

  async getLastTaskErrorBy(serviceInstanceId: string): Promise<Tasks> {
    const task = await this.taskTable.findOne({
      where: { serviceInstanceId: serviceInstanceId, status: 'error' },
      order: { startTime: { direction: 'DESC' } },
    });
    return task;
  }

  async getTask(
    options: SessionRequest,
    taskId: string,
  ): Promise<GetTasksReturnDto | null> {
    const userId = options.user.userId;
    const org = await this.organizationTableService.findOne({
      where: {
        user: { id: userId },
      },
    });
    let session;
    const customTask = await this.taskTable.findById(taskId);
    let data;
    if (isEmpty(customTask)) {
      // if (service.serviceTypeId === 'aradAi') {
      //   return Promise.resolve(null);
      // }
      // if (service.serviceTypeId === 'vgpu') {
      //   session = await this.sessionService.checkAdminSession();
      // }
      // if (service.serviceTypeId === 'vdc') {
      // }
      session = await this.sessionService.checkUserSession(userId, org.id);
      const vcloudTask = await mainWrapper.user.tasks.getTask(session, taskId);
      // const ownerName = vcloudTask.data.owner.name;
      // if (
      //   service.serviceTypeId === 'vgpu' &&
      //   ownerName.slice(0, ownerName.length - 2) !== service.id
      // ) {
      //   throw new ForbiddenException();
      // }
      let taskDetail = null;
      if (vcloudTask.data.status === 'error') {
        taskDetail = vcloudTask.data.details;
      }
      data = {
        details: taskDetail,
        startTime: vcloudTask.data.startTime,
        endTime: vcloudTask.data.endTime,
        status: vcloudTask.data.status,
        id: vcloudTask.data.id,
        operation: vcloudTask.data.operation,
      };
    } else {
      data = {
        details: customTask.details,
        startTime: customTask.startTime,
        endTime: customTask.endTime,
        status: customTask.status,
        id: customTask.taskId,
        operation: customTask.operation,
      };
    }

    return Promise.resolve(data);
  }

  async cancelTask(
    options: SessionRequest,
    vdcInstanceId: string,
    taskId: string,
  ): Promise<void> {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        vdcInstanceId,
      );
    const session = await this.sessionService.checkUserSession(
      userId,
      props.orgId,
    );
    await mainWrapper.user.tasks.cancelTask(session, taskId);
    return;
  }

  async retryCustomTasks(
    options: SessionRequest,
    taskId: string,
  ): Promise<void> {
    const task = await this.taskTable.findById(taskId);
    if (task.userId !== options.user.userId) {
      throw new ForbiddenException();
    }
    await this.taskManagerService.createFlow(
      task.operation as TasksEnum,
      task.serviceInstanceId,
      JSON.parse(task.operation),
      {
        reuseTask: true,
        task,
      },
    );
  }
}
