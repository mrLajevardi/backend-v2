import {
  Controller,
  Get,
  Inject,
  Param,
  Request,
  UseFilters,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigsTableService } from '../base/crud/configs-table/configs-table.service';
import { ItemTypesTableService } from '../base/crud/item-types-table/item-types-table.service';
import { ServicePropertiesTableService } from '../base/crud/service-properties-table/service-properties-table.service';
import { SessionsService } from '../base/sessions/sessions.service';
import { TaskManagerService } from '../base/tasks/service/task-manager.service';
import { isNil } from 'lodash';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { VgpuService } from './vgpu.service';
import { TasksTableService } from '../base/crud/tasks-table/tasks-table.service';
import { ServiceInstancesTableService } from '../base/crud/service-instances-table/service-instances-table.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/infrastructure/filters/http-exception.filter';
import { ServiceTypesTableService } from '../base/crud/service-types-table/service-types-table.service';
import { Raw } from 'typeorm';
import { BadRequestException } from 'src/infrastructure/exceptions/bad-request.exception';

@ApiTags('vgpu')
@Controller('vgpu')
// @UseFilters(new HttpExceptionFilter())
@ApiBearerAuth() // Requires authentication with a JWT token
export class VgpuController {
  constructor(
    private readonly service: VgpuService,
    private readonly jwtService: JwtService,
    private readonly configsTable: ConfigsTableService,
    private readonly sessionService: SessionsService,
    private readonly servicePropertiesTable: ServicePropertiesTableService,
    private readonly itemTypesTable: ItemTypesTableService,
    private readonly taskManagerService: TaskManagerService,
    private readonly tasksTable: TasksTableService,
    private readonly serviceInstancesTable: ServiceInstancesTableService,
    private readonly serviceTypeTable: ServiceTypesTableService,
  ) {}

  @ApiOperation({ summary: 'Get VGPU Item Type' })
  @ApiResponse({
    status: 200,
    description: 'Returns VGPU plans',
    type: 'array',
  })
  @Get('/vgpuPlans')
  async getvgpuPlans(): Promise<any> {
    const vgpuPlans = await this.configsTable.find({
      where: {
        propertyKey: Raw((alias) => `${alias} LIKE 'QualityPlans.%'`),
        serviceTypeId: 'vgpu',
      },
    });

    const planCost = await this.itemTypesTable.find({
      where: {
        code: Raw((alias) => `${alias} LIKE '%Cost%'`),
        serviceTypeId: 'vgpu',
      },
    });
    return Promise.resolve({ vgpuPlans, planCost });
  }

  @ApiOperation({ summary: 'Check and get Jupyter API' })
  @ApiResponse({
    status: 200,
    description: 'Returns VGPU URL',
    type: 'object',
  })
  @Get('/vGpu/:ServiceInstanceId/vgpuUrl')
  async getVgpuUrl(
    @Param('ServiceInstanceId') ServiceInstanceId: string,
  ): Promise<any> {
    const externalPort = await this.servicePropertiesTable.findOne({
      where: {
        serviceInstanceId: ServiceInstanceId,
        propertyKey: 'VgpuExternalPort',
      },
    });
    // TODO if external port is empty return error
    if (!externalPort) {
      throw new BadRequestException('No external port exists');
    }
    const props = {};
    const VgpuConfigs = await this.configsTable.find({
      where: {
        propertyKey: Raw((alias) => `${alias} LIKE '%config.vgpu.%'`),
      },
    });
    for (const prop of VgpuConfigs) {
      const key = prop.propertyKey.split('.').slice(-1)[0];
      const item = prop.value;
      props[key] = item;
    }

    const payload = {
      serviceInstanceId: ServiceInstanceId,
    };
    const token = this.jwtService.sign(payload, {
      secret: process.env.ARAD_VGPU_JWT_SECRET_KEY,
      expiresIn: 3600,
    });
    return Promise.resolve({
      vgpuUrl: `http://${props['externalAddresses']}':'${externalPort.value}/lab?token=${token}`,
    });
  }

  @ApiOperation({ summary: 'Deploy VGPU' })
  @ApiResponse({
    status: 200,
    description: 'Returns deployment data',
    type: 'object',
  })
  @Get('/vGpu/:ServiceInstanceId/vgpuDeploy')
  async vgpuDeploy(
    @Param('ServiceInstanceId') ServiceInstanceId: string,
    @Request() options,
  ): Promise<any> {
    const userId = options.user.userId;
    const serviceInstance = await this.serviceInstancesTable.findOne({
      where: {
        id: ServiceInstanceId,
        userId: userId,
      },
    });
    if (isNil(serviceInstance)) {
      return Promise.reject(new ForbiddenException());
    }

    await this.service.chackAvalibleToPowerOnVgpu(userId);
    const task = await this.tasksTable.create({
      userId: userId,
      serviceInstanceId: ServiceInstanceId,
      operation: 'deployVgpuVm',
      details: null,
      startTime: new Date(),
      endTime: null,
      status: 'running',
    });
    await this.taskManagerService.addTask({
      serviceInstanceId: ServiceInstanceId,
      customTaskId: task['TaskID'],
      vcloudTask: null,
      nextTask: 'deployVgpuVm',
      taskType: 'adminTask',
      requestOptions: options,
      target: 'object',
    });
    return Promise.resolve({
      id: ServiceInstanceId,
      taskId: task['TaskID'],
    });
  }

  @ApiOperation({ summary: 'Check VGPU deployment status' })
  @ApiResponse({
    status: 200,
    description: 'Returns deployment status data',
    type: 'object',
  })
  @Get('/vGpu/:ServiceInstanceId/vgpuStatusDeploy')
  async vgpuStatusDeploy(
    @Param('ServiceInstanceId') ServiceInstanceId: string,
    @Request() options,
  ): Promise<any> {
    const userId = options.user.userId;
    const vmName = ServiceInstanceId + 'VM';
    const VgpuConfigs = await this.configsTable.find({
      where: {
        propertyKey: Raw((alias) => `${alias} LIKE '%config.vgpu.%'`),
      },
    });
    const props = {};
    for (const prop of VgpuConfigs) {
      const key = prop.propertyKey.split('.').slice(-1)[0];
      const item = prop.value;
      props[key] = item;
    }

    const vdcIdVgpu = props['vdcId'].split(':').slice(-1);
    const session = await this.sessionService.checkAdminSession(userId);
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

  @ApiOperation({ summary: 'Undeploy VGPU' })
  @ApiResponse({
    status: 200,
    description: 'Returns undeployment data',
    type: 'object',
  })
  @Get('/vGpu/:ServiceInstanceId/vgpuUnDeploy')
  async vgpuUnDeploy(
    @Param('ServiceInstanceId') ServiceInstanceId: string,
    @Request() options,
  ): Promise<any> {
    const userId = options.user.userId;

    const serviceInstance = await this.serviceInstancesTable.findOne({
      where: {
        id: ServiceInstanceId,
        userId: userId,
      },
    });
    if (isNil(serviceInstance)) {
      return Promise.reject(new ForbiddenException());
    }
    const task = await this.tasksTable.create({
      userId: userId,
      serviceInstanceId: ServiceInstanceId,
      operation: 'unDeployVgpuVm',
      details: null,
      startTime: new Date(),
      endTime: null,
      status: 'running',
    });
    await this.taskManagerService.addTask({
      serviceInstanceId: ServiceInstanceId,
      customTaskId: task['TaskID'],
      vcloudTask: null,
      nextTask: 'unDeployVgpuVm',
      taskType: 'adminTask',
      requestOptions: options,
      target: 'object',
    });
    return Promise.resolve({
      id: ServiceInstanceId,
      taskId: task['TaskID'],
    });
  }
}
