import {
  BadGatewayException,
  ConflictException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { SessionsService } from '../../sessions/sessions.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { TasksTableService } from '../../crud/tasks-table/tasks-table.service';
import { ConfigsTableService } from '../../crud/configs-table/configs-table.service';
import { isEmpty } from 'lodash';
import { ServiceIsDeployException } from 'src/infrastructure/exceptions/service-is-deploy.exception';
import { TaskManagerService } from '../../tasks/service/task-manager.service';
import { VgpuService } from 'src/application/vgpu/vgpu.service';
import { VgpuModule } from 'src/application/vgpu/vgpu.module';

@Injectable()
export class DeleteServiceService {
  constructor(
    private readonly serviceInstancesTable: ServiceInstancesTableService,
    private readonly sessionsService: SessionsService,
    private readonly tasksTableService: TasksTableService,
    private readonly configsTable: ConfigsTableService,
    private readonly taskManagerService: TaskManagerService,
    private readonly vgpuService: VgpuService,
  ) {}

  async deleteService(options, serviceInstanceId) {
    const userId = options.user.userId;
    const serviceInstance = await this.serviceInstancesTable.findOne({
      where: {
        id: serviceInstanceId,
      },
    });
    let nextDeleteTask = null;
    let logAction = null;
    console.log('first');
    const serviceTypeID = serviceInstance.serviceTypeId;
    if (serviceInstance.status === 1) {
      throw new BadGatewayException();
    }
    if (serviceTypeID == 'vdc') {
      const adminSession = await this.sessionsService.checkAdminSession(null);
      const query = await mainWrapper.user.vdc.vcloudQuery(adminSession, {
        filter: `((name==networkEdgeGatewayDelete),(name==vdcDeleteVdc));((status==queued),(status==running))`,
        type: 'adminTask',
      });
      if (query.data.record.length > 0) {
        throw new ConflictException();
      }

      nextDeleteTask = 'deleteCatalogOrg';
    }
    const task = await this.tasksTableService.create({
      userId,
      serviceInstanceId: serviceInstanceId,
      operation: 'delete' + serviceTypeID.toUpperCase() + 'Service',
      details: null,
      startTime: new Date(),
      endTime: null,
      status: 'running',
    });
    console.log(task);
    let logType = serviceTypeID;
    if (serviceTypeID === 'aradAi') {
      nextDeleteTask = 'finishDeleteService';
      logType = 'aradAI';
      logAction = 'deleteAradAi';
    }
    if (serviceTypeID == 'vgpu') {
      // check if power off
      const props: any = {};
      const VgpuConfigs = await this.configsTable.find({
        where: {
          propertyKey: { like: '%config.vgpu.%' },
        },
      });
      for (const prop of VgpuConfigs) {
        const key = prop.propertyKey.split('.').slice(-1)[0];
        const item = prop.value;
        props[key] = item;
      }
      const vmName = serviceInstanceId + 'VM';
      const vdcIdVgpu = props.vdcId.split(':').slice(-1);
      const session = await this.sessionsService.checkAdminSession(props.orgId);
      const vmInfo = await this.vgpuService.getVmsInfo(
        session,
        vdcIdVgpu,
        props.orgId,
        props.orgName,
        `name==${vmName}`,
      );
      if (!isEmpty(vmInfo) && vmInfo[0].isDeployed === true) {
        throw new ServiceIsDeployException();
      }
      nextDeleteTask = 'deleteVgpu';
      logAction = nextDeleteTask;
    }

    if (serviceTypeID == 'vdc') {
      nextDeleteTask = 'deleteCatalogOrg';
      logAction = 'deleteVdc';
    }
    console.log({
      serviceInstanceId: serviceInstanceId,
      customTaskId: task.taskId,
      vcloudTask: null,
      target: 'task',
      nextTask: nextDeleteTask,
      taskType: 'adminTask',
      requestOptions: options,
    });
    await this.taskManagerService.addTask({
      serviceInstanceId: serviceInstanceId,
      customTaskId: task.taskId,
      vcloudTask: null,
      target: 'task',
      nextTask: nextDeleteTask,
      taskType: 'adminTask',
      requestOptions: options.user,
    });
    // await logger.info(logType, logAction, { _object: serviceInstanceId }, options.locals);
    console.log({
      id: serviceInstanceId,
      taskId: task.taskId,
    });
    return Promise.resolve({
      id: serviceInstanceId,
      taskId: task.taskId,
    });
  }
}
