import { ForbiddenException, Injectable } from '@nestjs/common';
import { TasksTableService } from '../../crud/tasks-table/tasks-table.service';
import { SessionsService } from '../../sessions/sessions.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { ConfigsTableService } from '../../crud/configs-table/configs-table.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { isEmpty } from 'lodash';
import { ServicePropertiesTableService } from '../../crud/service-properties-table/service-properties-table.service';
import { ServicePropertiesService } from '../../service-properties/service-properties.service';
import { VcloudErrorException } from 'src/infrastructure/exceptions/vcloud-error.exception';

@Injectable()
export class TasksService {
  constructor(
    private readonly taskTable: TasksTableService,
    private readonly sessionService: SessionsService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly serviceInstancesTable: ServiceInstancesTableService,
    private readonly configsTable: ConfigsTableService,
  ) {}

  async getTasksList(options, vdcInstanceId) {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        vdcInstanceId,
      );
    const service = await this.serviceInstancesTable.findById(vdcInstanceId);
    let session;
    let tasks;
    if (service.serviceTypeId === 'aradAi') {
      return Promise.resolve({});
    }
    if (service.serviceTypeId === 'vgpu') {
      session = await this.sessionService.checkAdminSession(null);
      const configsData = await this.configsTable.find({
        where: {
          propertyKey: {
            inq: ['config.vgpu.orgName', 'config.vgpu.orgId'],
          },
        },
      });
      const configs: any = {};
      configsData.forEach((property) => {
        configs[property.propertyKey] = property.value;
      });
      const { 'config.vgpu.orgName': orgName, 'config.vgpu.orgId': orgId } =
        configs;
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
    }
    if (service.serviceTypeId === 'vdc') {
      session = await this.sessionService.checkUserSession(userId, props.orgId);
      tasks = await mainWrapper.user.vdc.vcloudQuery(session, {
        type: 'task',
        page: 1,
        pageSize: 10,
        sortDesc: 'startDate',
      });
    }
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
    const filteredTasksList = ['jobEnable'];
    data = data.filter((data) => {
      return !filteredTasksList.includes(data.operation);
    });
    const customTasks = await this.taskTable.find({
      where: {
        serviceInstanceId: vdcInstanceId,
      },
      take: 10,
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

  async getTask(options, vdcInstanceId, taskId) {
    const userId = options.user.userId;
    const props: any =
      await this.servicePropertiesService.getAllServiceProperties(
        vdcInstanceId,
      );
    let session;
    const customTask = await this.taskTable.findById(taskId);
    const service = await this.serviceInstancesTable.findById(vdcInstanceId);
    console.log(service);
    let data;
    if (isEmpty(customTask)) {
      if (service.serviceTypeId === 'aradAi') {
        return Promise.resolve({});
      }
      if (service.serviceTypeId === 'vgpu') {
        session = await this.sessionService.checkAdminSession(null);
      }
      if (service.serviceTypeId === 'vdc') {
        session = await this.sessionService.checkUserSession(
          userId,
          props.orgId,
        );
      }
      const vcloudTask = await mainWrapper.user.tasks.getTask(session, taskId);
      console.log(vcloudTask.data);
      const ownerName = vcloudTask.data.owner.name;
      if (
        service.serviceTypeId === 'vgpu' &&
        ownerName.slice(0, ownerName.length - 2) !== service.id
      ) {
        throw new ForbiddenException();
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

  async cancelTask(options, vdcInstanceId, taskId) {
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
}
