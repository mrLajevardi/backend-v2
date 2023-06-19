import { Injectable } from '@nestjs/common';
import { TasksService } from '../base/tasks/service/tasks.service';
import { SessionsService } from '../base/sessions/sessions.service';
import { ServiceInstancesService } from '../base/service/service-instances/service/service-instances.service';
import { ServicePropertiesService } from '../base/service/service-properties/service-properties.service';
import { ServiceItemsService } from '../base/service/service-items/service-items.service';
import { ConfigsService } from '../base/service/configs/configs.service';
import { OrganizationService } from '../base/organization/organization.service';
import { UserService } from '../base/user/user/user.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { vcdConfig } from 'src/wrappers/mainWrapper/vcdConfig';

@Injectable()
export class VdcService {
  constructor(
    // private readonly taskService: TasksService,
    private readonly sessionService: SessionsService,
    private readonly serviceInstanceService: ServiceInstancesService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly serviceItemsService: ServiceItemsService,
    private readonly configService: ConfigsService,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
  ) {}

  async createVdc(
    userId,
    orgId,
    vcloudOrgId,
    orgName,
    data,
    serviceInstanceId,
  ) {
    const sessionToken = await this.sessionService.checkAdminSession(userId);
    const service = await this.serviceInstanceService.findOne({
      where: {
        ID: serviceInstanceId,
      },
    });
    const vdcExist = await this.checkVdcExistence(
      userId,
      orgId,
      serviceInstanceId,
    );
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
      const vdcNameProperty = await this.servicePropertiesService.findOne({
        where: {
          and: [
            { serviceInstanceId: serviceInstanceId },
            { PropertyKey: 'name' },
          ],
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
    // creates a new vdc name
    const vdcName = orgName + '_vdc_' + service.index;
    await this.servicePropertiesService.create({
      serviceInstanceId: serviceInstanceId,
      propertyKey: 'name',
      value: vdcName,
    });
    await this.servicePropertiesService.create({
      serviceInstanceId: serviceInstanceId,
      propertyKey: 'orgId',
      value: orgId,
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
      const vdcIdProperty = await this.servicePropertiesService.findOne({
        where: {
          and: [
            { serviceInstanceId: serviceInstanceId },
            { PropertyKey: 'vdcId' },
          ],
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

  /**
   * @param {Object} app
   * @param {String} userId
   * @param {String} orgId
   * @param {String} serviceInstanceId
   * @return {Promise}
   */
  async checkVdcExistence(userId, orgId, serviceInstanceId) {
    const vdcNameProperty = await this.servicePropertiesService.findOne({
      where: {
        and: [
          { serviceInstanceId: serviceInstanceId },
          { PropertyKey: 'name' },
        ],
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
    data,
    sessionToken,
    vdcName,
    vcloudOrgId,
    orgId,
    serviceInstanceId,
  ) {
    const cpuSpeed = await this.configService.findOne({
      where: {
        and: [{ PropertyKey: 'vCpuSpeed' }, { ServiceTypeID: 'vdc' }],
      },
    });
    const networkQuota = await this.configService.findOne({
      where: {
        and: [{ PropertyKey: 'networkQuota' }, { ServiceTypeID: 'vdc' }],
      },
    });
    const vdcInfo = await mainWrapper.admin.vdc.createVdc(
      {
        ProviderVdcReference: vcdConfig.admin.vdc.ProviderVdcReference,
        VdcStorageProfileParams: vcdConfig.admin.vdc.VdcStorageProfileParams,
        NetworkPoolReference: vcdConfig.admin.vdc.NetworkPoolReference,
        ResourceGuaranteedMemory: vcdConfig.admin.vdc.ResourceGuaranteedMemory,
        ResourceGuaranteedCpu: vcdConfig.admin.vdc.ResourceGuaranteedCpu,
        cores: data.cpuCores,
        vCpuInMhz: cpuSpeed.value,
        ram: data.ram,
        storage: data.storage,
        authToken: sessionToken,
        name: vdcName,
        vm: data.vm,
        NetworkQuota: networkQuota.value,
      },
      vcloudOrgId,
    );
    const props = [{ key: 'vdcId', value: vdcInfo.id }];
    props.forEach(async (prop) => {
      await this.servicePropertiesService.create({
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
    const sessionToken = await this.sessionService.checkAdminSession(userId);

    const deleteVdc = await mainWrapper.admin.vdc.deleteVdc(
      sessionToken,
      vdcId,
    );
    return Promise.resolve({
      __vcloudTask: deleteVdc.headers['location'],
    });
  }
}
