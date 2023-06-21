import { Controller } from '@nestjs/common';
import { CreateServiceService } from 'src/application/base/service/service-instances/service/create-service/create-service.service';
import { ServiceInstancesService } from 'src/application/base/service/service-instances/service/service-instances.service';
import { ServicePropertiesService } from 'src/application/base/service/service-properties/service-properties.service';
import { SessionsService } from 'src/application/base/sessions/sessions.service';
import { TaskManagerService } from 'src/application/base/tasks/service/task-manager.service';
import { TasksService } from 'src/application/base/tasks/service/tasks.service';
import { BadRequestException } from 'src/infrastructure/exceptions/bad-request.exception';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';

@Controller('vdc')
export class VdcController {
    constructor(
       // private readonly tasksService: TasksService,
        private readonly sessionService: SessionsService,
        private readonly servicePropertiesService : ServicePropertiesService,
    ){}

async attachNamedDisk (
    options,
    vdcInstanceId,
    nameDiskID,
    vmID,
  )  {
    const userId = options.accessToken.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(vdcInstanceId);
    const session = await this.sessionService.checkUserSession(
        userId,
        props['orgId'],
    );
    const namedDisk = await mainWrapper.user.vdc.attachNamedDisk(session, nameDiskID, vmID);
    // await logger.info(
    //   'services',
    //   'attachNamedDisk',
    //   {
    //     _object: namedDisk.__vcloudTask.split('task/')[1],
    //   },
    //   { ...options.locals },
    // );
    return Promise.resolve({
      taskId: namedDisk.__vcloudTask.split('task/')[1],
    });
  };
  
  async createNamedDisk(options, vdcInstanceId, data) {
    const userId = options.accessToken.userId;
    const { busType } = data;
    if (busType != 20) {
      return Promise.reject(new BadRequestException);
    }
    const props = await this.servicePropertiesService.getAllServiceProperties(vdcInstanceId);
    const session = await this.sessionService.checkUserSession(userId, props['orgId']);
    const namedDisk = await mainWrapper.user.vdc.createNamedDisk(session, props['vdcId'], data);
    const taskId = await mainWrapper.user.vdc.vcloudQuery(session, {
      page: 1,
      pageSize: 10,
      filter: 'object==' + namedDisk.__vcloudTask,
      type: 'task',
    });
    // await logger.info(
    //   'services',
    //   'createNamedDisk',
    //   {
    //     _object: taskId.data.record[0].href.split('task/')[1],
    //   },
    //   { ...options.locals },
    // );
    return Promise.resolve({
      taskId: taskId.data.record[0].href.split('task/')[1],
    });
  };
  
// async createVdc(Services, data, options) {
//     const createdService = await this.createServiceSvc.createBillingService(data, options,  'vdc');
//     const serviceInstanceId = createdService.serviceInstanceId;
//     options.locals = {
//       ...options.locals,
//       serviceInstanceId,
//     };
//     // await logger.info('vdc', 'createBillingService', { _object: serviceInstanceId }, options.locals);
//     const task = await this.tasksService.create({
//       userId: options.locals.userId,
//       serviceInstanceId: serviceInstanceId,
//       operation: 'createDataCenter',
//       details: null,
//       startTime: new Date(),
//       endTime: null,
//       status: 'running',
//     });
//     await this.taskManagerService.addTask({
//       serviceInstanceId,
//       customTaskId: task['TaskID'],
//       vcloudTask: null,
//       nextTask: 'createOrg',
//       requestOptions: options.locals,
//       target: 'object',
//     });
//     console.log(task);
//     return Promise.resolve({
//       id: serviceInstanceId,
//       taskId: task['TaskID'],
//     });
//   };
  
async dettachNamedDisk(
    options,
    vdcInstanceId,
    nameDiskID,
    vmID,
  ) {
    const userId = options.accessToken.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(vdcInstanceId);
    const session = await this.sessionService.checkUserSession(
        userId,
      props['orgId'],
    );
    const namedDisk = await mainWrapper.user.vdc.dettachNamedDisk(session, nameDiskID, vmID);
    // await logger.info(
    //   'services',
    //   'dettachNamedDisk',
    //   {
    //     _object: namedDisk.__vcloudTask.split('task/')[1],
    //   },
    //   { ...options.locals },
    // );
    return Promise.resolve({
      taskId: namedDisk.__vcloudTask.split('task/')[1],
    });
  };
  
  async getNamedDisk(options, vdcInstanceId) {
    const userId = options.accessToken.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(vdcInstanceId);
    const session = await this.sessionService.checkUserSession(
        userId,
      props['orgId'],
    );
    const recordList = await mainWrapper.user.vdc.getNamedDisk(
      session,
      props['vdcId'],
    );
    const recordListForFront = [];
    recordList.forEach((element) => {
      const id = element.href.split('https://vpc.aradcloud.com/api/disk/')[1];
      const name = element.name;
      const sizeMb = element.sizeMb;
      const description = element.description;
      const isAttached = element.isAttached;
      const ownerName = element.ownerName;
      const status = element.status;
      const attachedVmCount = element.attachedVmCount;
      recordListForFront.push({
        id,
        name,
        sizeMb,
        description,
        isAttached,
        ownerName,
        status,
        attachedVmCount,
        busType: element.busType,
        busSubType: element.busSubType,
        sharingType: element.sharingType,
        busTypeDesc: element.busTypeDesc,
      });
    });
    return Promise.resolve(recordListForFront);
  };
  
  /**
   * @param {Object} app
   * @param {Object} options
   * @param {String} vdcInstanceId
   * @return {Promise}
   */
  async getVdc(options, vdcInstanceId) {
    const userId = options.accessToken.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(vdcInstanceId);
    const session = await this.sessionService.checkUserSession(userId, props['orgId']);
    const vdcData = await mainWrapper.user.vdc.vcloudQuery(session, {
      type: 'orgVdc',
      format: 'records',
      page: 1,
      pageSize: 10,
      filter: `id==${props['vdcId']}`,
    });
    return Promise.resolve({
      instanceId: vdcInstanceId,
      records: vdcData.data.record,
    });
  }
  
  
  
  async getVmAttachedNamedDisk (
    options,
    vdcInstanceId,
    nameDiskID,
  ) {
    const userId = options.accessToken.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(vdcInstanceId);
    const session = await this.sessionService.checkUserSession(
        userId,
      props['orgId'],
    );
    const vmData = await mainWrapper.user.vdc.getVmAttachedNamedDisk(
      session,
      nameDiskID,
    );
  
    if (vmData.data) {
      return vmData.data.vmReference[0].href.split(
        'vApp/',
      )[1];
    }
    return Promise.resolve();
  };
  
  
  async removeNamedDisk (options, vdcInstanceId, nameDiskID) {
    const userId = options.accessToken.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(vdcInstanceId);
    const session = await this.sessionService.checkUserSession(
        userId,
      props['orgId'],
    );
    const namedDisk = await mainWrapper.user.vdc.removeNamedDisk(session, nameDiskID);
    // await logger.info(
    //   'services',
    //   'removeNamedDisk',
    //   {
    //     _object: namedDisk.__vcloudTask.split('task/')[1],
    //   },
    //   { ...options.locals },
    // );
    return Promise.resolve({
      taskId: namedDisk.__vcloudTask.split('task/')[1],
    });
  };
  
  
  async updateNamedDisk (
    options,
    vdcInstanceId,
    nameDiskID,
    data,
  ) {
    const userId = options.accessToken.userId;
    const { busType } = data;
    if (busType != 20) {
      return Promise.reject(new BadRequestException());
    }
    const props = await this.servicePropertiesService.getAllServiceProperties(vdcInstanceId);
    const session = await this.sessionService.checkUserSession(
        userId,
      props['orgId'],
    );
    const namedDisk = await mainWrapper.user.vdc.updateNamedDisk(
      session,
      props['vdcId'],
      nameDiskID,
      data,
    );
    // await logger.info(
    //   'services',
    //   'updateNamedDisk',
    //   {
    //     _object: namedDisk.__vcloudTask.split('task/')[1],
    //   },
    //   { ...options.locals },
    // );
    return Promise.resolve({
      taskId: namedDisk.__vcloudTask.split('task/')[1],
    });
  };
  
}
