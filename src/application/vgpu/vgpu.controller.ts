import { Controller } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigsTableService } from '../base/crud/configs-table/configs-table.service';
import { ItemTypesTableService } from '../base/crud/item-types-table/item-types-table.service';
import { ServicePropertiesTableService } from '../base/crud/service-properties-table/service-properties-table.service';
import { SessionsService } from '../base/sessions/sessions.service';
import { TaskManagerService } from '../base/tasks/service/task-manager.service';
import { isEmpty, isNil } from 'lodash';
import aradVgpuConfig from 'src/infrastructure/config/aradVgpuConfig';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { VgpuService } from './vgpu.service';

@Controller('vgpu')
export class VgpuController {
  constructor(
    private readonly service: VgpuService,
    private readonly jwtService: JwtService,
    private readonly configsTable: ConfigsTableService,
    private readonly sessionService: SessionsService,
    private readonly servicePropertiesTable: ServicePropertiesTableService,
    private readonly itemTypesTable: ItemTypesTableService,
    private readonly taskManagerService: TaskManagerService,
  ) {}

  async getVgpuPlans(options, filter, cb) {
    let parsedFilter = {};
    if (!isEmpty(filter)) {
      parsedFilter = JSON.parse(filter).where;
    }
    const vgpuPlans = await this.configsTable.find({
      where: {
        and: [
          { PropertyKey: { like: 'QualityPlans.%' } },
          { ServiceTypeID: 'vgpu' },
          parsedFilter,
        ],
      },
    });

    const planCost = await this.itemTypesTable.find({
      where: {
        and: [
          { Code: { like: '%Cost%' } },
          { ServiceTypeID: 'vgpu' },
          parsedFilter,
        ],
      },
    });
    return Promise.resolve({ vgpuPlans, planCost });
  }

  async getVgpuUrl(options, ServiceInstanceId) {
    const externalPort = await this.servicePropertiesTable.findOne({
      where: {
        and: [
          { ServiceInstanceID: ServiceInstanceId },
          { PropertyKey: 'VgpuExternalPort' },
        ],
      },
    });
    // TODO if external port is empty return error
    const props = {};
    const VgpuConfigs = await this.configsTable.find({
      where: {
        PropertyKey: { like: '%config.vgpu.%' },
      },
    });
    for (const prop of VgpuConfigs) {
      const key = prop.propertyKey.split('.').slice(-1)[0];
      const item = prop.value;
      props[key] = item;
    }

    const token = this.jwtService.sign(ServiceInstanceId, {
      secret: aradVgpuConfig.JWT_SECRET_KEY,
    });
    return Promise.resolve(
      'http://' +
        props['externalAddresses'] +
        ':' +
        externalPort.value +
        '/lab?token=' +
        token,
    );
  }

  async vgpuDeploy(app, options, ServiceInstanceId) {
    const userId = options.accessToken.userId;
    const serviceInstance = await app.models.ServiceInstances.findOne({
      where: {
        and: [{ ID: ServiceInstanceId }, { userId: userId }],
      },
    });
    if (isNil(serviceInstance)) {
      return Promise.reject(new ForbiddenException());
    }

    await this.service.chackAvalibleToPowerOnVgpu(userId);
    const task = await app.models.Tasks.create({
      UserID: userId,
      ServiceInstanceID: ServiceInstanceId,
      Operation: 'deployVgpuVm',
      Details: null,
      StartTime: new Date().toISOString(),
      EndTime: null,
      Status: 'running',
    });
    await this.taskManagerService.addTask({
      serviceInstanceId: ServiceInstanceId,
      customTaskId: task.TaskID,
      vcloudTask: null,
      target: 'task',
      nextTask: 'deployVgpuVm',
      taskType: 'adminTask',
      requestOptions: options,
      // target: 'object',
    });
    return Promise.resolve({
      id: ServiceInstanceId,
      taskId: task.TaskID,
    });
  }

  async vgpuStatusDeploy(app, options, ServiceInstanceId) {
    const userId = options.accessToken.userId;
    const vmName = ServiceInstanceId + 'VM';
    const VgpuConfigs = await app.models.Configs.find({
      where: {
        PropertyKey: { like: '%config.vgpu.%' },
      },
    });
    const props = {};
    for (const prop of VgpuConfigs) {
      const key = prop.PropertyKey.split('.').slice(-1);
      const item = prop.Value;
      props[key] = item;
    }

    const vdcIdVgpu = props['vdcId'].split(':').slice(-1);
    const session = await this.sessionService.checkAdminSession(props['orgId']);
    const vmInfo = await this.service.getVmsInfo(
      session,
      vdcIdVgpu,
      props['orgId'],
      props['orgName'],
      `name==${vmName}`,
    );

    const isDeployed = vmInfo[0].isDeployed;
    return Promise.resolve({
      isDeployed,
    });
  }

  async vgpuUnDeploy(app, options, ServiceInstanceId) {
    const userId = options.accessToken.userId;
    const serviceInstance = await app.models.ServiceInstances.findOne({
      where: {
        and: [{ ID: ServiceInstanceId }, { userId: userId }],
      },
    });
    if (isNil(serviceInstance)) {
      return Promise.reject(new ForbiddenException());
    }
    const task = await app.models.Tasks.create({
      UserID: userId,
      ServiceInstanceID: ServiceInstanceId,
      Operation: 'unDeployVgpuVm',
      Details: null,
      StartTime: new Date().toISOString(),
      EndTime: null,
      Status: 'running',
    });
    await this.taskManagerService.addTask({
      serviceInstanceId: ServiceInstanceId,
      customTaskId: task.TaskID,
      vcloudTask: null,
      target: 'task',
      nextTask: 'unDeployVgpuVm',
      taskType: 'adminTask',
      requestOptions: options,
      //  target: 'object',  //// WHY DUPLICATED??
    });
    return Promise.resolve({
      id: ServiceInstanceId,
      taskId: task.TaskID,
    });
  }
}
