import { Injectable } from '@nestjs/common';
import { ServicePropertiesService } from '../../service-properties/service-properties.service';
import { TasksTableService } from '../../crud/tasks-table/tasks-table.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { SessionsService } from '../../sessions/sessions.service';
import { isEmpty } from 'lodash';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { ConfigsTableService } from '../../crud/configs-table/configs-table.service';
import { In } from 'typeorm';
import { VcloudErrorException } from 'src/infrastructure/exceptions/vcloud-error.exception';

@Injectable()
export class TaskAdminService {
  constructor(
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly tasksTable: TasksTableService,
    private readonly serviceInstancesTable: ServiceInstancesTableService,
    private readonly sessionService: SessionsService,
    private readonly configTable: ConfigsTableService,
  ) {}

  async getTask(vdcInstanceId: string, taskId: string) {
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    let session;
    const customTask = await this.tasksTable.findById(taskId);
    const service = await this.serviceInstancesTable.findById(vdcInstanceId);
    const userId = service.userId;
    console.log(service);
    let data;
    data = {
      details: customTask.details,
      startTime: customTask.startTime,
      endTime: customTask.endTime,
      status: customTask.status,
      id: customTask.taskId,
      operation: customTask.operation,
    };
    if (service.serviceTypeId === 'aradAi') {
      return Promise.resolve(data);
    }
    if (service.serviceTypeId === 'vgpu') {
      session = await this.sessionService.checkAdminSession(userId);
    }
    if (service.serviceTypeId === 'vdc') {
      session = await this.sessionService.checkUserSession(
        userId,
        props['orgId'],
      );
    }
    if (isEmpty(customTask)) {
      const vcloudTask = await mainWrapper.user.tasks.getTask(session, taskId);
      console.log(vcloudTask.data);
      const ownerName = vcloudTask.data.owner.name;
      if (
        service.serviceTypeId === 'vgpu' &&
        ownerName.slice(0, ownerName.length - 2) !== service.id
      ) {
        return Promise.reject(new ForbiddenException());
      }
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
    }

    return Promise.resolve(data);
  }

  async getTasksList(vdcInstanceId: string) {
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const service = await this.serviceInstancesTable.findById(vdcInstanceId);
    const userId = service.userId;
    let session;
    let tasks;
    let data = [];
    if (service.serviceTypeId === 'vgpu') {
      session = await this.sessionService.checkAdminSession(userId);
      const configsData = await this.configTable.find({
        where: {
          propertyKey: In(['config.vgpu.orgName', 'config.vgpu.orgId']),
        },
      });
      const configs = {};
      configsData.forEach((property) => {
        configs[property.propertyKey] = property.value;
      });

      const orgName = configs['config.vgpu.orgName'];
      const orgId = configs['config.vgpu.orgId'];

      const filter = `objectName==${vdcInstanceId + 'VM'}`;
      tasks = await mainWrapper.user.vdc.vcloudQuery(
        session,
        {
          type: 'task',
          page: 1,
          pageSize: 10,
          sortDesc: 'startDate',
          filter,
        },
        {
          'X-vCloud-Authorization': orgName,
          'X-VMWARE-VCLOUD-AUTH-CONTEXT': orgName,
          'X-VMWARE-VCLOUD-TENANT-CONTEXT': orgId,
        },
      );
      if (!tasks || !tasks.data) {
        throw new VcloudErrorException();
      }
      for (const task of tasks.data.record) {
        data.push({
          startTime: task.startDate,
          endTime: task.endDate,
          status: task.status,
          id: task.href.split('task/')[1],
          object: task.object?.split('/').slice(-1)[0] || null,
          operation: task.name,
        });
      }
    }
    if (service.serviceTypeId === 'vdc') {
      session = await this.sessionService.checkUserSession(
        userId,
        props['orgId'],
      );
      tasks = await mainWrapper.user.vdc.vcloudQuery(session, {
        type: 'task',
        page: 1,
        pageSize: 10,
        sortDesc: 'startDate',
      });

      if (!tasks || !tasks.data) {
        throw new VcloudErrorException();
      }

      for (const task of tasks.data.record) {
        data.push({
          startTime: task.startDate,
          endTime: task.endDate,
          status: task.status,
          id: task.href.split('task/')[1],
          object: task.object?.split('/').slice(-1)[0] || null,
          operation: task.name,
        });
      }
    }
    const filteredTasksList = ['jobEnable'];
    data = data.filter((data) => {
      return !filteredTasksList.includes(data.operation);
    });
    if (
      service.serviceTypeId === 'aradAi' ||
      service.serviceTypeId === 'aradAiDemo'
    ) {
      data = [];
    }
    const customTasks = await this.tasksTable.find({
      where: {
        serviceInstanceId: vdcInstanceId,
      },
      take: 10, // Equivalent to "limit"
      order: {
        taskId: 'DESC',
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
    data = data.slice(0, 10);
    return Promise.resolve(data);
  }
}
