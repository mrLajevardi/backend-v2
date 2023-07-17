import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Queue } from 'bull';
import { SessionsService } from '../../sessions/sessions.service';
import { TasksService } from './tasks.service';
import { isEmpty } from 'lodash';
import { OrganizationService } from '../../organization/organization.service';
import { VdcService } from 'src/application/vdc/service/vdc.service';
import { EdgeService } from 'src/application/vdc/service/edge.service';
import { OrgService } from 'src/application/vdc/service/org.service';
import { NetworkService } from 'src/application/vdc/service/network.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { vcloudQuery } from 'src/wrappers/mainWrapper/user/vdc/vcloudQuery';
import { iTask } from '../interface/task.interface';
import { TasksTableService } from '../../crud/tasks-table/tasks-table.service';
import { OrganizationTableService } from '../../crud/organization-table/organization-table.service';
import { ServiceInstancesTableService } from '../../crud/service-instances-table/service-instances-table.service';
import { ServicePropertiesTableService } from '../../crud/service-properties-table/service-properties-table.service';
import { ServiceItemsTableService } from '../../crud/service-items-table/service-items-table.service';
import { ConfigsTableService } from '../../crud/configs-table/configs-table.service';
import { UserTableService } from '../../crud/user-table/user-table.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { VgpuService } from 'src/application/vgpu/vgpu.service';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('tasks')
export class TaskManagerService {
  constructor(
    @InjectQueue('tasks')
    private taskQueue: Queue,
    private readonly taskService: TasksService,
    private readonly sessionService: SessionsService,
    private readonly serviceInstancesTable: ServiceInstancesTableService,
    private readonly servicePropertiesTable: ServicePropertiesTableService,
    private readonly serviceItemsTable: ServiceItemsTableService,
    private readonly configsTable: ConfigsTableService,
    private readonly organizationTable: OrganizationTableService,
    private readonly userTable: UserTableService,
    private readonly edgeService: EdgeService,
    private readonly orgService: OrgService,
    private readonly networkService: NetworkService,
    private readonly vdcService: VdcService,
    private readonly taskTable: TasksTableService,
    private readonly loggerService: LoggerService,
    @Inject(forwardRef(() => VgpuService))
    private readonly vgpuService: VgpuService,
  ) {}

  @Process()
  async processTask(job: Job, done) {
    const taskType = job.data?.taskType || 'task';
    if (job.data.vcloudTask === null) {
      this.taskRunner(
        job.data.nextTask,
        job.data.serviceInstanceId,
        job.data.customTaskId,
        job.data?.requestOptions || null,
      );
      return done();
    }
    const session = await this.sessionService.checkAdminSession(null);
    let filter = `object==${job.data.vcloudTask}`;
    if (job.data.target === 'task') {
      filter = `href==${job.data.vcloudTask}`;
    }
    const task = await mainWrapper.user.vdc.vcloudQuery(session, {
      type: taskType,
      page: 1,
      pageSize: 30,
      sortDesc: 'startDate',
      filter,
    });
    if (
      task.data.record[0].status === 'running' ||
      task.data.record[0].status === 'queued'
    ) {
      const timeout = setTimeout(() => {
        this.taskQueue.add(job.data);
        clearTimeout(timeout);
      }, 1500);
      return done();
    } else if (task.data.record[0].status === 'error') {
      this.saveTaskStatus(
        'error',
        job.data.customTaskId,
        'vdc creation has been failed',
      );
      await this.serviceInstancesTable.updateAll(
        {
          // MOVE: where is this parameter from?
          //id: this.serviceInstanceId,
        },
        {
          status: 3,
        },
      );
      return done();
    } else {
      this.taskRunner(
        job.data.nextTask,
        job.data.serviceInstanceId,
        job.data.customTaskId,
        job.data?.requestOptions || null,
      );
      return done();
    }
  }
  // adds a task to task queue
  async addTask(task: iTask) {
    await this.taskQueue.add(task);
  }

  /**
   *
   * @param {String} status
   * @param {String} customTaskId
   * @param {String} details
   */
  async saveTaskStatus(status, customTaskId, details = null) {
    await this.taskTable.updateAll(
      { taskId: customTaskId },
      {
        details: details,
        endTime: new Date(),
        status: status,
      },
    );
  }

  taskRunner(taskName, serviceInstanceId, customTaskId, requestOptions = {}) {
    // const tasks = {
    //   createEdge: this.createEdgeTask,
    //   createOrg: this.createOrgTask,
    //   createVdc: this.createVdcTask,
    //   finishVdcTask: this.finishVdcTask,
    //   createNetwork: this.createNetworkTask,
    //   deleteVdc: this.deleteVdcTask,
    //   finishDeleteService: this.finishDeleteServiceTask,
    //   disableVms: this.checkVdcVmsTask,
    //   updateNetworkProfile: this.updateNetworkProfileTask,
    //   // createVgpuSnat: this.createVgpuSnatTask,
    //   createVgpuDnat: this.createVgpuDnatTask,
    //   // createVgpuVm: this.createVgpuVmTask,
    //   // createVgpuRunScript: this.createVgpuRunScriptTask,
    //   // deployVgpuVm: this.deployVgpuVmTask,
    //   finishVgpu: this.finishVgpuTask,
    //   turnOffVgpuVms: this.turnOffVgpuVmsTask,
    //   finishTurnOffVgpu: this.finishTurnOffVgpuTask,
    //   // deleteVgpu: this.deleteVgpuTask,
    //   // unDeployVgpuVm: this.unDeployVgpuVmTask,
    //   // deleteVgpuSnat: this.deleteVgpuSnatTask,
    //   // deleteVgpuDnat: this.deleteVgpuDnatTask,
    //   finishTurnOffGpuByUser: this.finishTurnOffGpuByUserTask,
    //   deleteCatalogOrg: this.deleteCatalogOrgTask,
    // };
    return this[taskName](
      serviceInstanceId,
      customTaskId,
      requestOptions,
    ).catch(async (err) => {
      console.log(err);
      try {
        await this.serviceInstancesTable.updateAll(
          {
            id: serviceInstanceId,
          },
          {
            status: 2,
          },
        );
        await this.saveTaskStatus(
          'error',
          customTaskId,
          'vdc ~ has been failed',
        );
        await this.loggerService.error({
          stackTrace: err?.stack,
          message: err?.message,
          userId: requestOptions['userId'] || null,
        });
      } catch (err) {
        console.log(err);
      }
    });
  }

  async checkVdcVms(serviceInstanceId, customTaskId, requestOptions) {
    const service = await this.serviceInstancesTable.findById(
      serviceInstanceId,
    );
    const userId = service.userId;
    const ServiceProperties = await this.servicePropertiesTable.find({
      where: {
        serviceInstanceId,
      },
    });
    const props = {};
    for (const prop of ServiceProperties) {
      props[prop.propertyKey] = prop.value;
    }
    const session = await this.sessionService.checkUserSession(
      props['orgId'],
      userId,
    );
    const filter = `(isVAppTemplate==false;vdc==${props['vdcId']})`;
    const query = await mainWrapper.user.vdc.vcloudQuery(session, {
      type: 'vm',
      filter,
    });
    const vmList = query.data.record;
    let vcloudTask = null;
    let poweredOnVm = false;
    for (const vm of vmList) {
      console.log(vm);
      if (vm.status === 'POWERED_ON') {
        poweredOnVm = true;
        const vmId = vm.href.split('/').slice(-1)[0];
        const undeployedVm = await mainWrapper.user.vm.undeployVm(
          session,
          vmId,
          'powerOff',
        );
        vcloudTask = undeployedVm.__vcloudTask;
      }
    }
    if (poweredOnVm) {
      await this.taskQueue.add({
        serviceInstanceId: service.id,
        customtaskId: null,
        requestOptions: {},
        vcloudTask,
        nextTask: 'disableVms',
        target: 'task',
        taskType: 'adminTask',
      });
    } else {
      await this.serviceInstancesTable.updateAll(
        {
          id: serviceInstanceId,
        },
        {
          isDeleted: true,
        },
      );
      await this.taskTable.updateAll(
        {
          taskId: customTaskId,
        },
        {
          status: 'success',
          endTime: new Date(),
        },
      );
      await this.loggerService.info(
        'vdc',
        'disableVdc',
        {
          _object: serviceInstanceId,
        },
        { ...requestOptions },
      );
    }
  }

  async createEdge(serviceInstanceId, customTaskId, requestOptions) {
    const service = await this.serviceInstancesTable.findById(
      serviceInstanceId,
    );
    const userId = service.userId;
    const ServiceProperties = await this.servicePropertiesTable.find({
      where: {
        serviceInstanceId,
      },
    });
    const props = {};
    for (const prop of ServiceProperties) {
      props[prop.propertyKey] = prop.value;
    }
    const session = await this.sessionService.checkUserSession(
      props['orgId'],
      userId,
    );
    const query = await mainWrapper.user.vdc.vcloudQuery(session, {
      type: 'orgVdc',
      filter: `name==${props['name']}`,
    });
    const checkVdcId = await this.servicePropertiesTable.findOne({
      where: {
        serviceInstanceId,
        propertyKey: 'vdcId',
      },
    });
    if (!checkVdcId) {
      props['vdcId'] = query.data.record[0].href.split('/').slice(-1)[0];
      props['vdcId'] = `urn:vcloud:vdc:${props['vdcId']}`;
      await this.servicePropertiesTable.create({
        serviceInstanceId: serviceInstanceId,
        propertyKey: 'vdcId',
        value: props['vdcId'],
      });
    } else {
      props['vdcId'] = checkVdcId.value;
    }
    await this.loggerService.info(
      'vdc',
      'createVdc',
      {
        vdcName: props['name'],
        vdcId: props['vdcId'],
        _object: props['vdcId'],
      },
      requestOptions,
    );
    const ip = await this.serviceItemsTable.findOne({
      where: {
        serviceInstanceId,
        itemTypeCode: 'ip',
      },
    });
    const org = await this.organizationTable.findOne({
      where: { userId },
    });
    const createdEdge = await this.edgeService.createEdge(
      props['vdcId'],
      ip.quantity,
      props['name'],
      serviceInstanceId,
      org.orgId,
      userId,
    );
    console.log('end of createEdge');
    const vcloudTask = createdEdge.__vcloudTask;
    this.taskQueue.add({
      serviceInstanceId,
      customTaskId,
      vcloudTask,
      target: 'task',
      nextTask: 'finishVdcTask',
      requestOptions,
    });
  }

  async createNetwork(serviceInstanceId, customTaskId, requestOptions) {
    const service = await this.serviceInstancesTable.findById(
      serviceInstanceId,
    );
    const userId = service.userId;
    const ServiceProperties = await this.servicePropertiesTable.find({
      where: {
        serviceInstanceId,
      },
    });
    const props = {};
    for (const prop of ServiceProperties) {
      props[prop.propertyKey] = prop.value;
    }
    const network = await this.networkService.createNetwork(
      '192.168.1.1',
      props['vdcId'],
      props['orgId'],
      props['edgeName'],
      userId,
    );

    await this.loggerService.info(
      'network',
      'createNetwork',
      {
        _object: network.__vcloudTask.split('task/')[1],
      },
      { ...requestOptions },
    );
  }

  async createOrg(serviceInstanceId, customTaskId, requestOptions) {
    const service = await this.serviceInstancesTable.findById(
      serviceInstanceId,
    );
    const userId = service.userId;
    const org = await this.orgService.checkOrg(userId);
    if (org.isNew) {
      // await this.loggerService.info(
      //   'vdc',
      //   'createOrg',
      //   {
      //     _object: org.id,
      //   },
      //   requestOptions,
      // );
    }
    const vcloudTask = org.__vcloudTask;
    this.taskQueue.add({
      serviceInstanceId,
      customTaskId,
      vcloudTask,
      target: 'object',
      nextTask: 'createVdc',
      requestOptions,
    });
    console.log('end of createOrg');
  }

  async createVdc(serviceInstanceId, customTaskId, requestOptions) {
    console.log('😙', serviceInstanceId, customTaskId, requestOptions);
    const service = await this.serviceInstancesTable.findById(
      serviceInstanceId,
    );
    const userId = service.userId;
    const ServiceItems = await this.serviceItemsTable.find({
      where: {
        serviceInstanceId,
      },
    });
    const data = {};
    for (const item of ServiceItems) {
      data[item.itemTypeCode] = item.quantity;
    }
    const org = await this.orgService.checkOrg(userId);
    const createdVdc = await this.vdcService.createVdc(
      userId,
      org.id,
      org.vcloudOrgId,
      org.name,
      data,
      serviceInstanceId,
    );
    const vcloudTask = createdVdc.__vcloudTask;

    this.taskQueue.add({
      serviceInstanceId,
      customTaskId,
      vcloudTask,
      target: 'object',
      nextTask: 'updateNetworkProfile',
      requestOptions,
    });
  }

  async createVgpuDnat(serviceInstanceId, customTaskId, requestOptions) {
    let externalPort = 20000;
    const service = await this.serviceInstancesTable.findById(
      serviceInstanceId,
    );
    const userId = service.userId;
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

    const internalIP = await this.servicePropertiesTable.findOne({
      where: {
        serviceInstanceId,
        propertyKey: 'internalIP',
      },
    });

    const VgpuExternalPort = await this.servicePropertiesTable.findOne({
      where: {
        and: [{ PropertyKey: 'VgpuExternalPort' }],
      },
      order: { id: -1 },
    });

    if (!isEmpty(VgpuExternalPort)) {
      externalPort = parseInt(VgpuExternalPort.value) + 1;
    }

    const internalAddresses = internalIP.value;
    const createDnat = await this.vgpuService.createVgpuDnat(
      serviceInstanceId,
      userId,
      props['orgId'],
      props['edgeName'],
      props['externalAddresses'],
      internalAddresses,
      'DNAT',
      externalPort,
      props['applicationPortProfileName'],
      props['applicationPortProfileId'],
    );

    // await logger.info(
    //   'vgpu', 'createDnat', {
    //     vgpuDnatName: serviceInstanceId + 'DNAT',
    //   }, requestOptions,
    // );
    const vcloudTask = createDnat.__vcloudTask;

    this.taskQueue.add({
      serviceInstanceId,
      customTaskId,
      vcloudTask,
      target: 'task',
      nextTask: 'createVgpuRunScript',
      taskType: 'adminTask',
      requestOptions,
    });
  }

  // async createVgpuRunScriptTask(serviceInstanceId, customTaskId, requestOptions) {
  //     const service = await this.serviceInstancesTable.findById(serviceInstanceId);
  //     const userId = service.userId;
  //     const props = {};

  //     const VgpuConfigs = await this.configsTable.find({
  //         where: {
  //             PropertyKey: { like: '%config.vgpu.%' },
  //         },
  //     });
  //     for (const prop of VgpuConfigs) {
  //         const key = prop.propertyKey.split('.').slice(-1)[0];
  //         const item = prop.value;
  //         props[key] = item;
  //     }

  //     const ServiceProperties = await this.servicePropertiesTable.find({
  //         where: {
  //             serviceInstanceid: serviceInstanceId,
  //         },
  //     });

  //     const pcProps = {};
  //     for (const pcProp of ServiceProperties) {
  //         pcProps[pcProp.propertyKey] = pcProp.value;
  //     }
  //     const adminPassword = pcProps['pcPassword'];
  //     const computerName = pcProps['pcName'];
  //     const createVgpuScript = await createVgpuRunScript(

  //         serviceInstanceId,
  //         userId,
  //         props['vdcId'],
  //         props.orgId,
  //         props.orgName,
  //         adminPassword,
  //         computerName,
  //     );

  // await this.loggerService.info(
  //   'vgpu', 'createCustomizeScript', {
  //     serviceInstanceId,
  //   }, requestOptions,
  // );
  //     const vcloudTask = createVgpuScript.__vcloudTask;
  //     this.taskQueue.add({
  //         serviceInstanceId,
  //         customTaskId,
  //         vcloudTask,
  //         target: 'task',
  //         nextTask: 'deployVgpuVm',
  //         taskType: 'adminTask',
  //         requestOptions,
  //     });
  // }

  // async createVgpuSnatTask(serviceInstanceId, customTaskId, requestOptions) {
  //     const service = await this.serviceInstancesTable.findById(serviceInstanceId);
  //     const userId = service.userId;
  //     const props = {};

  //     const VgpuConfigs = await this.configsTable.find({
  //         where: {
  //             PropertyKey: { like: '%config.vgpu.%' },
  //         },
  //     });
  //     for (const prop of VgpuConfigs) {
  //         const key = prop.propertyKey.split('.').slice(-1)[0];
  //         const item = prop.value;
  //         props[key] = item;
  //     }

  //     const internalIP = await this.servicePropertiesTable.findOne({
  //         where: {
  //             and: [{ serviceInstanceid: serviceInstanceId }, { PropertyKey: 'internalIP' }],
  //         },
  //     });
  //     const internalAddresses = internalIP.value;
  //     const createSnat = await createVgpuSnat(
  //         serviceInstanceId, userId, props['orgId'], props['edgeName'], props['externalAddresses'], internalAddresses, 'SNAT',
  //     );
  // await this.loggerService.info(
  //   'vgpu', 'createSnat', {
  //     vgpuSnatName: serviceInstanceId + 'SNAT',
  //   }, requestOptions,
  // );
  //     const vcloudTask = createSnat.__vcloudTask;

  //     this.taskQueue.add({
  //         serviceInstanceId,
  //         customTaskId,
  //         vcloudTask,
  //         target: 'task',
  //         nextTask: 'createVgpuDnat',
  //         taskType: 'adminTask',
  //         requestOptions,
  //     });
  // }

  // async createVgpuVmTask(serviceInstanceId, customTaskId, requestOptions) {
  //     const service = await this.serviceInstancesTable.findById(serviceInstanceId);
  //     const userId = service.userId;
  //     const props = {};

  //     const ServiceProperties = await this.servicePropertiesTable.find({
  //         where: {
  //             serviceInstanceid: serviceInstanceId,
  //         },
  //     });

  //     const pcProps = {};
  //     for (const pcProp of ServiceProperties) {
  //         pcProps[pcProp.propertyKey] = pcProp.value;
  //     }
  //     const computerName = pcProps['pcName'];
  //     const VgpuConfigs = await this.configsTable.find({
  //         where: {
  //             or: [
  //                 { PropertyKey: { like: '%config.vgpu.%' } },
  //                 { PropertyKey: { like: '%config.' + pcProps['plan'] + '.%' } },
  //             ],
  //         },
  //     });
  //     for (const prop of VgpuConfigs) {
  //         const key = prop.propertyKey.split('.').slice(-1);
  //         const item = prop.value;
  //         props[key] = item;
  //     }
  //     const createVm = await createVgpuVm(

  //         serviceInstanceId,
  //         userId,
  //         props['vdcId'],
  //         props['orgId'],
  //         props['templateId'],
  //         props['templateName'],
  //         props['networkId'],
  //         props['networkName'],
  //         computerName,
  //         props['vdcComputePolicy'],
  //     );
  //     await this.loggerService.info(
  //         'vgpu', 'createVm', {
  //         serviceInstanceId,
  //     }, requestOptions,
  //     );
  //     const vcloudTask = createVm.__vcloudTask;
  //     this.taskQueue.add({
  //         serviceInstanceId,
  //         customTaskId,
  //         vcloudTask,
  //         target: 'task',
  //         nextTask: 'createVgpuSnat',
  //         taskType: 'adminTask',
  //         requestOptions,
  //     });
  // }

  async deleteCatalogOrg(serviceInstanceId, customTaskId, requestOptions) {
    const service = await this.serviceInstancesTable.findById(
      serviceInstanceId,
    );
    const userId = service.userId;
    let vcloudTask = null;
    const session = await this.sessionService.checkAdminSession(
      userId.toString(),
    );
    // const vdcName = props?.name;
    const user = await this.userTable.findById(userId);
    const vdcName = user?.username + '_org_vdc_' + service.index;

    const query = await mainWrapper.user.vdc.vcloudQuery(session, {
      type: 'adminOrgVdc',
      filter: `name==*${vdcName}*`,
    });
    if (!isEmpty(query.data.record[0])) {
      const orgId = query.data.record[0].org.split('/').slice(-1)[0];
      const userSession = await this.sessionService.checkUserSession(
        orgId,
        userId,
      );
      const catalogId = await this.checkCatalog(userSession);
      const totalVdcs = query.data.total;
      // Delete Catalog, If last vdc in org
      if (totalVdcs < 2 && catalogId != null) {
        const deleteCatalog = await this.orgService.deleteCatalogOrg(
          userSession,
          catalogId,
        );
        vcloudTask = deleteCatalog.__vcloudTask;
      }
    }

    this.taskQueue.add({
      serviceInstanceId,
      customTaskId,
      vcloudTask,
      target: 'task',
      requestOptions,
      taskType: 'adminTask',
      nextTask: 'deleteVdc',
    });
  }

  async checkCatalog(authToken) {
    const catalogName = 'user-catalog';
    const queryOptions = {
      type: 'catalog',
      page: 1,
      pageSize: 15,
      sortAsc: 'name',
      filter: `name==${catalogName}`,
    };
    const catalogsList = await vcloudQuery(authToken, queryOptions);
    let catalogId = null;
    const catalogRecord = catalogsList?.data?.record;
    if (catalogRecord && catalogRecord[0]?.name == catalogName) {
      catalogId = catalogRecord[0].href.split('catalog/')[1];
    }
    return Promise.resolve(catalogId);
  }

  async deleteVdc(serviceInstanceId, customTaskId, requestOptions) {
    const service = await this.serviceInstancesTable.findById(
      serviceInstanceId,
    );
    let vcloudTask = null;
    const userId = service.userId;
    const user = await this.userTable.findById(userId);
    const vdcName = user?.username + '_org_vdc_' + service.index;
    const session = await this.sessionService.checkAdminSession(
      userId.toString(),
    );
    const query = await mainWrapper.user.vdc.vcloudQuery(session, {
      type: 'adminOrgVdc',
      filter: `name==${vdcName}`,
    });
    if (!isEmpty(query.data.record[0])) {
      const orgId = query.data.record[0].org.split('/').slice(-1)[0];
      let vdcId = query.data.record[0].href.split('/').slice(-1)[0];
      vdcId = `urn:vcloud:vdc:${vdcId}`;
      const deletedVdc = await this.vdcService.deleteVdc(
        userId,
        orgId,
        vdcId,
        serviceInstanceId,
      );
      vcloudTask = deletedVdc.__vcloudTask;
    }

    this.taskQueue.add({
      serviceInstanceId,
      customTaskId,
      vcloudTask,
      target: 'task',
      requestOptions,
      nextTask: 'finishDeleteService',
    });
  }

  // async deleteVgpuDnatTask(serviceInstanceId, customTaskId, requestOptions) {
  //     const props = {};
  //     const VgpuConfigs = await this.configsTable.find({
  //         where: {
  //             PropertyKey: { like: '%config.vgpu.%' },
  //         },
  //     });

  //     for (const prop of VgpuConfigs) {
  //         const key = prop.propertyKey.split('.').slice(-1)[0];
  //         const item = prop.value;
  //         props[key] = item;
  //     }

  //     const service = await this.serviceInstancesTable.findById(serviceInstanceId);
  //     const userId = service.userId;
  //     const natName = serviceInstanceId + 'DNAT';
  //     const deleteVgpuSnat = await deleteVgpuNat(userId, props['orgId'], props['edgeName'], natName);

  //     const vcloudTask = deleteVgpuSnat.__vcloudTask;
  //     this.taskQueue.add({
  //         serviceInstanceId,
  //         customTaskId,
  //         vcloudTask,
  //         target: 'task',
  //         nextTask: 'deleteVgpuSnat',
  //         taskType: 'adminTask',
  //         requestOptions,
  //     });
  // }

  // async deleteVgpuSnatTask(serviceInstanceId, customTaskId, requestOptions) {
  //     const props = {};
  //     const VgpuConfigs = await this.configsTable.find({
  //         where: {
  //             PropertyKey: { like: '%config.vgpu.%' },
  //         },
  //     });

  //     for (const prop of VgpuConfigs) {
  //         const key = prop.propertyKey.split('.').slice(-1);
  //         const item = prop.value;
  //         props[key] = item;
  //     }

  //     const service = await this.serviceInstancesTable.findById(serviceInstanceId);
  //     const userId = service.userId;
  //     const natName = serviceInstanceId + 'SNAT';
  //     const deleteVgpuSnat = await deleteVgpuNat(userId, props['orgId'], props['edgeName'], natName);

  //     const vcloudTask = deleteVgpuSnat.__vcloudTask;
  //     this.taskQueue.add({
  //         serviceInstanceId,
  //         customTaskId,
  //         vcloudTask,
  //         target: 'task',
  //         nextTask: 'finishDeleteService',
  //         taskType: 'adminTask',
  //         requestOptions,
  //     });
  // }

  // async deleteVgpuTask(serviceInstanceId, customTaskId, requestOptions) {
  //     const props = {};
  //     const VgpuConfigs = await this.configsTable.find({
  //         where: {
  //             PropertyKey: { like: '%config.vgpu.%' },
  //         },
  //     });

  //     for (const prop of VgpuConfigs) {
  //         const key = prop.propertyKey.split('.').slice(-1);
  //         const item = prop.value;
  //         props[key] = item;
  //     }
  //     const service = await this.serviceInstancesTable.findById(serviceInstanceId);
  //     const userId = service.userId;
  //     const session = await new CheckSession(userId).checkAdminSession(props['orgId']);
  //     const vdcIdVgpu = props['vdcId'].split(':').slice(-1);

  //     const query = await mainWrapper.user.vdc.vcloudQuery(
  //         session
  //         , {
  //             type: 'vm',
  //             filter: `(isVAppTemplate==false;vdc==${vdcIdVgpu});(name==${serviceInstanceId + 'VM'})`,
  //         },
  //         {
  //             'X-vCloud-Authorization': props['orgName'],
  //             'X-VMWARE-VCLOUD-AUTH-CONTEXT': props['orgName'],
  //             'X-VMWARE-VCLOUD-TENANT-CONTEXT': props['orgId'],
  //         },
  //     );
  //     let vcloudTask = null;
  //     let nextTask = 'finishDeleteService';
  //     if (!isEmpty(query.data.record[0])) {
  //         const vAppId = query.data.record[0].href.split('/').slice(-1);
  //         const deleteVgpu = await mainWrapper.user.vm.deleteVm(session, vAppId);
  //         vcloudTask = deleteVgpu.__vcloudTask;
  //         nextTask = 'deleteVgpuDnat';
  //     }

  //     this.taskQueue.add({
  //         serviceInstanceId,
  //         customTaskId,
  //         vcloudTask,
  //         target: 'task',
  //         nextTask,
  //         taskType: 'adminTask',
  //         requestOptions,
  //     });
  // }

  // async deployVgpuVmTask(serviceInstanceId, customTaskId, requestOptions) {
  //     const service = await this.serviceInstancesTable.findById(serviceInstanceId);
  //     const userId = service.userId;
  //     const props = {};

  //     const VgpuConfigs = await this.configsTable.find({
  //         where: {
  //             PropertyKey: { like: '%config.vgpu.%' },
  //         },
  //     });
  //     for (const prop of VgpuConfigs) {
  //         const key = prop.propertyKey.split('.').slice(-1);
  //         const item = prop.value;
  //         props[key] = item;
  //     }

  //     const deployVm = await deployVgpuVm(
  //         serviceInstanceId, userId, props['vdcId'], props['orgId'], props['orgName'],
  //     );
  //     let vcloudTask = null;
  //     if (deployVm != null) {
  //         vcloudTask = deployVm.__vcloudTask;
  //     }
  //     this.taskQueue.add({
  //         serviceInstanceId,
  //         customTaskId,
  //         vcloudTask,
  //         target: 'task',
  //         nextTask: 'finishVgpu',
  //         taskType: 'adminTask',
  //         requestOptions,
  //     });
  // }

  async finishDeleteService(serviceInstanceId, customTaskId, requestOptions) {
    const currentDate = new Date(new Date().getTime() + 1000 * 60);
    await this.serviceInstancesTable.updateAll(
      {
        id: serviceInstanceId,
      },
      {
        isDeleted: true,
        deletedDate: currentDate,
      },
    );

    await this.serviceInstancesTable.updateAll(
      {
        id: serviceInstanceId,
      },
      {
        status: 3,
      },
    );
    await this.taskTable.updateAll(
      {
        taskId: customTaskId,
      },
      {
        status: 'success',
      },
    );
  }

  async finishTurnOffGpuByUserTask(
    serviceInstanceId,
    customTaskId,
    requestOptions,
  ) {
    await this.serviceInstancesTable.updateAll(
      {
        id: serviceInstanceId,
      },
      {
        status: 3,
      },
    );
    await this.taskTable.updateAll(
      {
        taskId: customTaskId,
      },
      {
        status: 'success',
      },
    );
  }

  async finishTurnOffVgpuTask(serviceInstanceId, customTaskId, requestOptions) {
    await this.serviceInstancesTable.updateAll(
      {
        id: serviceInstanceId,
      },
      {
        // true
        isDisabled: 1,
      },
    );
    await this.serviceInstancesTable.updateAll(
      {
        id: serviceInstanceId,
      },
      {
        status: 3,
      },
    );
    await this.taskTable.updateAll(
      {
        taskId: customTaskId,
      },
      {
        status: 'success',
      },
    );
  }

  async finishVdcTask(serviceInstanceId, customTaskId, requestOptions) {
    // await logger.info('vdc', 'createEdge', {
    //     _object: serviceInstanceId,
    // }, requestOptions);
    await this.serviceInstancesTable.updateAll(
      {
        id: serviceInstanceId,
      },
      {
        status: 3,
      },
    );
    await this.taskTable.updateAll(
      {
        taskId: customTaskId,
      },
      {
        status: 'success',
        endTime: new Date(),
      },
    );
    this.taskQueue.add({
      serviceInstanceId,
      customTaskId,
      vcloudTask: null,
      target: null,
      nextTask: 'createNetwork',
      requestOptions,
    });
  }

  async finishVgpuTask(serviceInstanceId, customTaskId, requestOptions) {
    const externalPort = await this.servicePropertiesTable.findOne({
      where: {
        and: [
          { serviceInstanceId: serviceInstanceId },
          { PropertyKey: 'VgpuExternalPort' },
        ],
      },
    });
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

    // const token = jwt.sign(serviceInstanceId, JWT_SECRET_KEY);
    // const url = 'http://' + props.externalAddresses + ':' + externalPort.Value + '/lab/login?token=' + token;
    // const checkUrl = setInterval(async () => {
    //   await axios.get(url)
    //       .then(async (res) => {
    //         if (res.status === 200) {
    //           await this.serviceInstancesTable.updateAll({
    //             id: serviceInstanceId,
    //           }, {
    //             IsDisabled: false, status: 3,
    //           });
    //           await this.taskService.updateAll(
    //               {
    //                 taskId: customTaskId,
    //               }, {
    //                 status: 'success',
    //               });
    //           clearInterval(checkUrl);
    //         }
    //       })
    //       .catch((err) => console.error(err));
    // }, 5000);

    await this.serviceInstancesTable.updateAll(
      {
        id: serviceInstanceId,
      },
      {
        //false
        isDisabled: 0,
        status: 3,
      },
    );
    await this.taskTable.updateAll(
      {
        taskId: customTaskId,
      },
      {
        status: 'success',
      },
    );
  }

  async turnOffVgpuVmsTask(serviceInstanceId, customTaskId, requestOptions) {
    const service = await this.serviceInstancesTable.findOne({
      where: {
        id: serviceInstanceId,
      },
    });
    const userId = service.userId;
    const session = await this.sessionService.checkAdminSession(
      userId.toString(),
    );
    const configsData = await this.configsTable.find({
      where: {
        PropertyKey: {
          inq: ['config.vgpu.orgName', 'config.vgpu.orgId'],
        },
      },
    });
    let configs: any;
    configsData.forEach((property) => {
      configs[property.propertyKey] = property.value;
    });
    const { 'config.vgpu.orgName': orgName, 'config.vgpu.orgId': orgId } =
      configs;
    const filter = `(isVAppTemplate==false);(name==${
      serviceInstanceId + 'VM'
    })`;
    const query = await mainWrapper.user.vdc.vcloudQuery(
      session,
      {
        type: 'vm',
        filter,
      },
      {
        'X-vCloud-Authorization': orgName,
        'X-VMWARE-VCLOUD-AUTH-CONTEXT': orgName,
        'X-VMWARE-VCLOUD-TENANT-CONTEXT': orgId,
      },
    );
    const vm = query.data.record[0];
    const vmId = vm.href.split('/').slice(-1)[0];
    const undeployedVm = await mainWrapper.user.vm.undeployVm(
      session,
      vmId,
      'powerOff',
    );
    const vcloudTask = undeployedVm.__vcloudTask;
    await this.taskQueue.add({
      serviceInstanceId: service.id,
      customtaskId: null,
      requestOptions: {},
      vcloudTask,
      nextTask: 'finishTurnOffVgpu',
      target: 'task',
      taskType: 'adminTask',
    });
  }

  // async unDeployVgpuVmTask(serviceInstanceId, customTaskId, requestOptions) {
  //     const service = await this.serviceInstancesTable.findById(serviceInstanceId);
  //     const userId = service.userId;
  //     const props = {};

  //     const VgpuConfigs = await this.configsTable.find({
  //         where: {
  //             PropertyKey: { like: '%config.vgpu.%' },
  //         },
  //     });
  //     for (const prop of VgpuConfigs) {
  //         const key = prop.propertyKey.split('.').slice(-1)[0];
  //         const item = prop.value;
  //         props[key] = item;
  //     }

  //     const unDeployVm = await unDeployVgpuVm(
  //         userId, serviceInstanceId, props['vdcId'], props['orgId'], props['orgName'],
  //     );

  //     let vcloudTask = null;
  //     if (unDeployVm != null) {
  //         vcloudTask = unDeployVm.__vcloudTask;
  //     }
  //     this.taskQueue.add({
  //         serviceInstanceId,
  //         customTaskId,
  //         vcloudTask,
  //         target: 'task',
  //         nextTask: 'finishTurnOffGpuByUser',
  //         taskType: 'adminTask',
  //         requestOptions,
  //     });
  // }

  async updateNetworkProfile(serviceInstanceId, customTaskId, requestOptions) {
    const service = await this.serviceInstancesTable.findById(
      serviceInstanceId,
    );
    const userId = service.userId;
    const ServiceProperties = await this.servicePropertiesTable.find({
      where: {
        serviceInstanceId,
      },
    });
    const props = {};
    for (const prop of ServiceProperties) {
      props[prop.propertyKey] = prop.value;
    }
    const session = await this.sessionService.checkAdminSession(
      userId.toString(),
    );
    const networkProfile = await mainWrapper.admin.vdc.updateNetworkProfile(
      props['vdcId'],
      session,
    );
    const { __vcloudTask: vcloudTask } = networkProfile;
    await this.loggerService.info(
      'vdc',
      'updateNetworkProfile',
      {
        vdcName: props['name'],
        vdcId: props['vdcId'],
        _object: props['vdcId'],
      },
      requestOptions,
    );
    this.taskQueue.add({
      serviceInstanceId,
      customTaskId,
      vcloudTask,
      target: 'task',
      nextTask: 'createEdge',
      taskType: 'adminTask',
      requestOptions,
    });
  }
}
