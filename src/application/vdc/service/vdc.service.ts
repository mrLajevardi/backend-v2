import { Injectable } from '@nestjs/common';
import { TasksService } from '../../base/tasks/service/tasks.service';
import { SessionsService } from '../../base/sessions/sessions.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { vcdConfig } from 'src/wrappers/mainWrapper/vcdConfig';
import { ServiceInstancesTableService } from 'src/application/base/crud/service-instances-table/service-instances-table.service';
import { ServicePropertiesTableModule } from 'src/application/base/crud/service-properties-table/service-properties-table.module';
import { ServicePropertiesTableService } from 'src/application/base/crud/service-properties-table/service-properties-table.service';
import { ServiceItemsTableService } from 'src/application/base/crud/service-items-table/service-items-table.service';
import { ConfigsTableService } from 'src/application/base/crud/configs-table/configs-table.service';
import { OrganizationTableService } from 'src/application/base/crud/organization-table/organization-table.service';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';

@Injectable()
export class VdcService {
  constructor(
    // private readonly taskService: TasksService,
    private readonly sessionService: SessionsService,
    private readonly serviceInstanceTable: ServiceInstancesTableService,
    private readonly servicePropertiesTable: ServicePropertiesTableService,
    private readonly serviceItemsTable: ServiceItemsTableService,
    private readonly configTable: ConfigsTableService,
    private readonly organizationTable: OrganizationTableService,
    private readonly userTable: UserTableService,
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
    console.log(userId, '🍟');
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
        serviceInstanceId,
        propertyKey: 'name',
      },
    });
    const vdcName = vdcNameProperty?.value;
    const session = await this.sessionService.checkUserSession(orgId, userId);
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
    const vdcInfo: any = await mainWrapper.admin.vdc.createVdc(
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
