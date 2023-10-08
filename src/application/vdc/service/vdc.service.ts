import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SessionsService } from '../../base/sessions/sessions.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { vcdConfig } from 'src/wrappers/mainWrapper/vcdConfig';
import { ServiceInstancesTableService } from 'src/application/base/crud/service-instances-table/service-instances-table.service';
import { ServicePropertiesTableService } from 'src/application/base/crud/service-properties-table/service-properties-table.service';
import { ConfigsTableService } from 'src/application/base/crud/configs-table/configs-table.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { ServicePropertiesService } from 'src/application/base/service-properties/service-properties.service';
import { VdcWrapperService } from '../../../wrappers/main-wrapper/service/user/vdc/vdc-wrapper.service';
import { VdcFactoryService } from './vdc.factory.service';
import { GetOrgVdcResult } from '../../../wrappers/main-wrapper/service/user/vdc/dto/get-vdc-orgVdc.result.dt';
import { VdcDetailsResultDto } from '../dto/vdc-details.result.dto';
import { ServiceService } from '../../base/service/services/service.service';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { GetAllVdcServiceWithItemsResultDto } from '../../base/service/dto/get-all-vdc-service-with-items-result.dto';
import {
  BASE_SERVICE_ITEM_SERVICE,
  BaseServiceItem,
} from '../../base/service-item/interface/service/service-item.interface';
import {
  BASE_VDC_DETAIL_SERVICE,
  BaseVdcDetailService,
} from '../interface/service/base-vdc-detail-service.interface';

@Injectable()
export class VdcService {
  constructor(
    private readonly sessionService: SessionsService,
    private readonly vdcFactoryService: VdcFactoryService,
    private readonly serviceInstanceTable: ServiceInstancesTableService,
    private readonly servicePropertiesTable: ServicePropertiesTableService,
    private readonly configTable: ConfigsTableService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly vdcWrapperService: VdcWrapperService,
    // @Inject(forwardRef(() => servicePropertiesService))
    // private readonly servicePropertiesService: servicePropertiesService,
    private readonly loggerService: LoggerService,
    private readonly serviceService: ServiceService,
    @Inject(BASE_SERVICE_ITEM_SERVICE)
    private readonly serviceItemService: BaseServiceItem,
    @Inject(BASE_VDC_DETAIL_SERVICE)
    private readonly vdcDetailService: BaseVdcDetailService,
  ) {}

  async createVdc(
    userId: number,
    orgId: number,
    vcloudOrgId: string,
    orgName: string,
    data: object,
    serviceInstanceId: string,
  ) {
    const sessionToken = await this.sessionService.checkAdminSession();
    console.log('find service ', '🍟');
    const service = await this.serviceInstanceTable.findOne({
      where: {
        id: serviceInstanceId,
      },
    });
    const vdcExist = await this.checkVdcExistence(
      userId,
      orgId,
      serviceInstanceId,
    );
    console.log('vdc exists', vdcExist);
    if (service.status == 2 || vdcExist !== null) {
      // service is broken
      const repair = await this.repairVdc(userId, orgId, serviceInstanceId);
      if (repair.isOk) {
        return Promise.resolve({
          id: repair['vdcId'],
          name: repair['name'],
          __vcloudTask: null,
        });
      }
      const vdcNameProperty = await this.servicePropertiesTable.findOne({
        where: {
          serviceInstanceId,
          propertyKey: 'name',
        },
      });
      // uses current vdc name
      const vdcName = vdcNameProperty.value;
      return this.initVdc(
        data,
        sessionToken,
        vdcName,
        vcloudOrgId,
        orgId,
        serviceInstanceId,
      );
    }
    console.log('create new vdc');
    // creates a new vdc name
    const vdcName = orgName + '_vdc_' + service.index;
    console.log(vdcName, '🍔');
    await this.servicePropertiesTable.create({
      serviceInstanceId: serviceInstanceId,
      propertyKey: 'name',
      value: vdcName,
    });
    await this.servicePropertiesTable.create({
      serviceInstanceId: serviceInstanceId,
      propertyKey: 'orgId',
      value: orgId.toString(),
    });
    return this.initVdc(
      data,
      sessionToken,
      vdcName,
      vcloudOrgId,
      orgId,
      serviceInstanceId,
    );
  }
  /**
   * @param {Object} app
   * @param {String} userId
   * @param {String} orgId
   * @param {String} serviceInstanceId
   * @return {Promise}
   */
  async repairVdc(userId, orgId, serviceInstanceId) {
    const checkVdc = await this.checkVdcExistence(
      userId,
      orgId,
      serviceInstanceId,
    );
    if (checkVdc) {
      // vdc has been created in cloud
      const vdcIdProperty = await this.servicePropertiesTable.findOne({
        where: {
          serviceInstanceId,
          propertyKey: 'vdcId',
        },
      });
      const vdcId = checkVdc.href.split('/').slice(-1)[0];
      const urnVdcId = `urn:vcloud:vdc:${vdcId}`;
      if (vdcIdProperty !== null) {
        // vdc has been created in cloud and its saved in db
        return {
          isOk: true,
          data: checkVdc,
        };
      }
      // vdc has been created in cloud and its not saved in db
      return {
        isOk: true,
        data: {
          name: checkVdc.name,
          vdcId: urnVdcId,
        },
      };
    }
    // needs to be created again
    return {
      isOk: false,
      data: null,
    };
  }

  async checkVdcExistence(userId, orgId, serviceInstanceId) {
    const vdcNameProperty = await this.servicePropertiesTable.findOne({
      where: {
        serviceInstanceId: serviceInstanceId,
        propertyKey: 'name',
      },
    });
    const vdcName = vdcNameProperty?.value;
    const session = await this.sessionService.checkUserSession(userId, orgId);
    const query = await mainWrapper.user.vdc.vcloudQuery(session, {
      type: 'orgVdc',
      filter: `name==${vdcName}`,
    });
    if (query.data.record.length > 0) {
      return query.data.record[0];
    }
    return null;
  }
  /**
   * @param {Object} app
   * @param {Object} data
   * @param {String} sessionToken
   * @param {String} vdcName
   * @param {String} vcloudOrgId
   * @param {String} orgId
   * @param {String} serviceInstanceId
   * @return {Promise}
   */
  async initVdc(
    data: object,
    sessionToken: string,
    vdcName: string,
    vcloudOrgId: string,
    orgId: number,
    serviceInstanceId: string,
  ) {
    console.log('init vdc');
    const cpuSpeed = await this.configTable.findOne({
      where: {
        propertyKey: 'vCpuSpeed',
        serviceTypeId: 'vdc',
      },
    });
    const networkQuota = await this.configTable.findOne({
      where: {
        propertyKey: 'networkQuota',
        serviceTypeId: 'vdc',
      },
    });
    console.log('create vdc with wrapper with data: ', data);
    const vdcInfo: any = await mainWrapper.admin.vdc.createVdc(
      {
        ProviderVdcReference: vcdConfig.admin.vdc.ProviderVdcReference,
        VdcStorageProfileParams: vcdConfig.admin.vdc.VdcStorageProfileParams,
        NetworkPoolReference: vcdConfig.admin.vdc.NetworkPoolReference,
        ResourceGuaranteedMemory: vcdConfig.admin.vdc.ResourceGuaranteedMemory,
        ResourceGuaranteedCpu: vcdConfig.admin.vdc.ResourceGuaranteedCpu,
        cores: data['cpuCores'],
        vCpuInMhz: cpuSpeed.value,
        ram: data['ram'],
        storage: data['storage'],
        authToken: sessionToken,
        name: vdcName,
        vm: data['vm'],
        NetworkQuota: networkQuota.value,
      },
      vcloudOrgId,
    );
    const props = [{ key: 'vdcId', value: vdcInfo.id }];
    props.forEach(async (prop) => {
      await this.servicePropertiesTable.create({
        serviceInstanceId: serviceInstanceId,
        propertyKey: prop.key,
        value: prop.value,
      });
    });
    return Promise.resolve({
      id: vdcInfo.id,
      name: vdcName,
      executionTime: vdcInfo.executionTime,
      __vcloudTask: vdcInfo.__vcloudTask,
    });
  }

  /**
   * @param {Object} app
   * @param {String} userId
   * @param {String} orgId
   * @param {String} vdcId
   * @param {String} serviceInstanceId
   * @return {Promise}
   */
  async deleteVdc(userId, orgId, vdcId, serviceInstanceId) {
    const sessionToken = await this.sessionService.checkAdminSession();

    const deleteVdc = await mainWrapper.admin.vdc.deleteVdc(
      sessionToken,
      vdcId,
    );
    return Promise.resolve({
      __vcloudTask: deleteVdc.headers['location'],
    });
  }

  async attachNamedDisk(options, vdcInstanceId, nameDiskID, vmID) {
    const userId = options.user.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const namedDisk = await mainWrapper.user.vdc.attachNamedDisk(
      session,
      nameDiskID,
      vmID,
    );
    await this.loggerService.info(
      'services',
      'attachNamedDisk',
      {
        _object: namedDisk.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: namedDisk.__vcloudTask.split('task/')[1],
    });
  }
  async createNamedDisk(options, vdcInstanceId, data) {
    const userId = options.user.userId;
    const { busType } = data;
    if (busType != 20) {
      throw new BadRequestException();
    }
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const namedDisk = await mainWrapper.user.vdc.createNamedDisk(
      session,
      props['vdcId'],
      data,
    );
    const taskId = await mainWrapper.user.vdc.vcloudQuery(session, {
      page: 1,
      pageSize: 10,
      filter: 'object==' + namedDisk.__vcloudTask,
      type: 'task',
    });
    await this.loggerService.info(
      'services',
      'createNamedDisk',
      {
        _object: taskId.data.record[0].href.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: taskId.data.record[0].href.split('task/')[1],
    });
  }

  async detachNamedDisk(options, vdcInstanceId, nameDiskID, vmID) {
    const userId = options.user.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const namedDisk = await mainWrapper.user.vdc.dettachNamedDisk(
      session,
      nameDiskID,
      vmID,
    );
    await this.loggerService.info(
      'services',
      'dettachNamedDisk',
      {
        _object: namedDisk.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: namedDisk.__vcloudTask.split('task/')[1],
    });
  }
  async getNamedDisk(options, vdcInstanceId) {
    const userId = options.user.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
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
      const id = element.href.split('disk/')[1];
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
  }

  /**
   * @param {Object} app
   * @param {Object} options
   * @param {String} vdcInstanceId
   * @return {Promise}
   */
  async getVdc(
    options: SessionRequest,
    vdcInstanceId,
  ): Promise<GetOrgVdcResult> {
    const userId = options.user.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const vdcData = await this.vdcWrapperService.vcloudQuery<any>(session, {
      type: 'orgVdc',
      format: 'records',
      page: 1,
      pageSize: 10,
      filter: `id==${props['vdcId']}`,
    });

    const model = this.vdcFactoryService.getVdcOrgVdcModelResult(vdcData);

    const test = await this.getNamedDisk(options, vdcInstanceId);

    console.log('test ', test);
    console.log('end test ');

    return Promise.resolve(model);

    // return Promise.resolve({
    //   instanceId: vdcInstanceId,
    //   records: vdcData.data,
    // });
  }

  async getVmAttachedToNamedDisk(options, vdcInstanceId, nameDiskID) {
    const userId = options.user.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const vmData = await mainWrapper.user.vdc.getVmAttachedNamedDisk(
      session,
      nameDiskID,
    );

    if (vmData.data) {
      return vmData.data.vmReference[0].href.split('vApp/')[1];
    }
    return Promise.resolve();
  }

  async removeNamedDisk(options, vdcInstanceId, nameDiskID) {
    const userId = options.user.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const namedDisk = await mainWrapper.user.vdc.removeNamedDisk(
      session,
      nameDiskID,
    );
    await this.loggerService.info(
      'services',
      'removeNamedDisk',
      {
        _object: namedDisk.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: namedDisk.__vcloudTask.split('task/')[1],
    });
  }

  async updateNamedDisk(options, vdcInstanceId, nameDiskID, data) {
    const userId = options.user.userId;
    const { busType } = data;
    if (busType != 20) {
      return Promise.reject(new BadRequestException());
    }
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
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
    await this.loggerService.info(
      'services',
      'updateNamedDisk',
      {
        _object: namedDisk.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: namedDisk.__vcloudTask.split('task/')[1],
    });
  }

  async getVdcDetail(
    option: SessionRequest,
    serviceInstanceId: string,
  ): Promise<VdcDetailsResultDto> {
    /**
     * getting model of vdc list -- select from tbl_ServiceInstance and join to ServiceItem and
     * Select guarantyItemName from tbl_ItemTypeName -- calling storage details in main-wrapper
     * -- bind disk to model of list vdc --
     * create final model --
     * done !!!
     */

    const modelVdc = (await this.serviceService.getServicesWithItems(
      option,
      'vdc',
      serviceInstanceId,
    )) as GetAllVdcServiceWithItemsResultDto;

    const guarantyTitle = await this.serviceItemService.getGuarantyTitleBy(
      serviceInstanceId,
    );

    const serviceproperties =
      await this.servicePropertiesService.getAllServiceProperties(
        serviceInstanceId,
      );

    //TODO --> How can I find vdcId with ServiceInstanceId
    const vpcStorageDetail = await this.vdcDetailService.getStorageDetailVdc(
      serviceproperties['vdcId'],
      option,
    );

    const vdcDetailsResult = await this.vdcDetailService.getVdcDetail(
      serviceInstanceId,
    );
    vdcDetailsResult.servicePlanType = modelVdc.servicePlanType;
    vdcDetailsResult.serviceName = modelVdc.name;
    vdcDetailsResult.daysLeft = modelVdc.daysLeft;
    vdcDetailsResult.status = modelVdc.status;
    vdcDetailsResult.disk = vpcStorageDetail;

    vdcDetailsResult.guaranty.title = guarantyTitle;

    return null;
  }
}
