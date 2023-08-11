import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { isEmpty } from 'lodash';
import { ServiceInstancesTableService } from 'src/application/base/crud/service-instances-table/service-instances-table.service';
import { TasksTableService } from 'src/application/base/crud/tasks-table/tasks-table.service';
import { Roles } from 'src/application/base/security/ability/decorators/roles.decorator';
import { PredefinedRoles } from 'src/application/base/security/ability/enum/predefined-enum.type';
import { PoliciesGuard } from 'src/application/base/security/ability/guards/policies.guard';
import { ServicePropertiesService } from 'src/application/base/service-properties/service-properties.service';
import { SessionsService } from 'src/application/base/sessions/sessions.service';
import { TaskManagerService } from 'src/application/base/tasks/service/task-manager.service';
import { BadRequestException } from 'src/infrastructure/exceptions/bad-request.exception';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';

@Controller('vdc/admin')
@ApiBearerAuth()
@UseGuards(PoliciesGuard)
@Roles(PredefinedRoles.AdminRole)
export class VdcAdminController {
  constructor(
    private readonly serviceInstancesTableService: ServiceInstancesTableService,
    private readonly tasksTable: TasksTableService,
    private readonly sessionService: SessionsService,
    private readonly taskManagerService: TaskManagerService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly logger: LoggerService,
  ) {}
  /**
   * delete vdc by admin
   * @param {Object} app
   * @param {Object} options
   * @param {String} vdcInstanceId
   * @return {Promise}
   */
  async adminDeleteVdc(options, vdcInstanceId) {
    const userId = options.accessToken.userId;
    const serviceInstance = await this.serviceInstancesTableService.findOne({
      where: {
        id: vdcInstanceId,
      },
    });
    if (serviceInstance.status === 1) {
      const error = new BadRequestException('unable to delete vdc');
      // const error = new Error('unable to delete vdc');
      // error.statusCode = 400;
      // error.code = 'RUNNING_VDC_SERVICE';
      return Promise.reject(error);
    }

    const task = await this.tasksTable.create({
        userId: userId,
        serviceInstanceId: vdcInstanceId,
        operation: 'deleteVdcService',
        details: null,
        startTime: new Date(),
        endTime: null,
        status: 'running',
    });

    await this.taskManagerService.addTask({
        serviceInstanceId: vdcInstanceId,
        customTaskId: task['TaskID'],
        vcloudTask: null,
        target: 'task',
        nextTask: 'deleteVdc',
        taskType: 'adminTask',
        requestOptions: options,
    });

    await this.logger.info('vdc', 'deleteVdc', { _object: vdcInstanceId }, options.locals);
    return Promise.resolve({
        id: vdcInstanceId,
        taskId: task['TaskID'],
    });
  }

  /**
   * @param {Object} app
   * @param {Object} options
   * @param {String} vdcInstanceId
   * @return {Promise}
   */
  async adminGetVdcInfo(options, vdcInstanceId) {
    const service = await this.serviceInstancesTableService.findOne({
      where: {
        id: vdcInstanceId,
      },
    });
    console.log(service);
    const userId = service.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
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

  /**
   * get vdc by admin
   * @param {Object} app
   * @param {Object} options
   * @param {String} page
   * @param {String} pageSize
   * @param {String} vdcInstanceId
   * @param {Object} filter
   * @return {Promise}
   */
  async adminGetVdc(options, page, pageSize, filter) {
    let parsedFilter = {};
    let skip = 0;
    let limit = 10;

    if (!isEmpty(filter)) {
      parsedFilter = JSON.parse(filter).where;
    }

    if (!isEmpty(page)) {
      skip = pageSize * (page - 1);
    }

    if (!isEmpty(pageSize)) {
      limit = pageSize;
    }

    const vdcServices = await this.serviceInstancesTableService.find({
      relations: ['Users', 'ServiceItems'],
      where: {
       isDeleted: false,
       serviceTypeId: 'vdc',
       ...parsedFilter
      },
      take: limit,
      skip: skip,
    });

    parsedFilter['IsDeleted'] = false;
    parsedFilter['ServiceTypeID'] = 'vdc';
    const countAll = await this.serviceInstancesTableService.count(
      parsedFilter,
    );

    return Promise.resolve({ vdcServices, countAll });
  }
  /**
   *
   * @param {Object} app
   * @param {Object} options
   * @param {String} vdcInstanceId
   * @return {Promise}
   */
  async adminRepairVdc(options, vdcInstanceId) {
    const service = await this.serviceInstancesTableService.findOne({
      where: {
        id: vdcInstanceId,
      },
    });
    const error = new BadRequestException('nable to repair vdc');
    // const error = new Error('unable to repair vdc');
    // error.statusCode = 400;
    if (service.status == 1) {
      //            error.code = 'RUNNING_VDC_SERVICE';
      return Promise.reject(error);
    } else if (service.status == 3) {
      //          error.code = 'COMPLETED_VDC_SERVICE';
      return Promise.reject(error);
    }
    // const task = await this.tasksService.create({
    //     userId: options.locals.userId,
    //     serviceInstanceId: vdcInstanceId,
    //     operation: 'createDataCenter',
    //     details: null,
    //     startTime: new Date(),
    //     endTime: null,
    //     status: 'running',
    // });
    await this.serviceInstancesTableService.updateAll(
      {
        id: vdcInstanceId,
      },
      {
        status: 1,
      },
    );
    // await this.taskManagerService.addTask({
    //     serviceInstanceId: vdcInstanceId,
    //     customTaskId: task['TaskID'],
    //     vcloudTask: null,
    //     nextTask: 'createOrg',
    //     target: 'object',
    //     requestOptions: options.locals,
    // });
    // return Promise.resolve({
    //     taskId: task['TaskID'],
    // });
  }
}
