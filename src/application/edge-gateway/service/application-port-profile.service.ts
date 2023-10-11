import { Injectable } from '@nestjs/common';
import { SessionsService } from '../../base/sessions/sessions.service';
import { OrganizationTableService } from '../../base/crud/organization-table/organization-table.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { isNil } from 'lodash';
import { ApplicationProfileListDto } from '../dto/application-profile-list.dto';
import { ServicePropertiesService } from 'src/application/base/service-properties/service-properties.service';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';

@Injectable()
export class ApplicationPortProfileService {
  constructor(
    private readonly logger: LoggerService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly sessionService: SessionsService,
    private readonly organizationTable: OrganizationTableService,
  ) {}

  /**
   * @param {Object} app
   * @param {Object} options
   * @param {String} vdcInstanceId
   * @param {Object} data
   * @return {Promise}
   */
  async createApplicationPortProfile(options, vdcInstanceId, data) {
    const userId = options.user.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const vcloudOrg = await this.organizationTable.findById(props['orgId']);
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const config = {
      orgId: vcloudOrg.orgId,
      vdcId: props['vdcId'],
      applicationPorts: data.applicationPorts,
      name: data.name,
      description: data.description,
    };
    const application =
      await mainWrapper.user.applicationPortProfile.createApplicationPortProfile(
        session,
        config,
      );
    await this.logger.info(
      'applicationPortProfiles',
      'createApplicationPortProfiles',
      {
        _object: application.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: application.__vcloudTask.split('task/')[1],
    });
  }

  /**
   * @param {Object} app
   * @param {Object} options
   * @param {String} vdcInstanceId
   * @param {String} applicationId
   * @return {Promise}
   */
  async deleteApplicationPortProfile(options, vdcInstanceId, applicationId) {
    const userId = options.user.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const application =
      await mainWrapper.user.applicationPortProfile.deleteApplicationPortProfile(
        session,
        applicationId,
      );
    await this.logger.info(
      'applicationPortProfiles',
      'deleteApplicationPortProfiles',
      {
        _object: application.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: application.__vcloudTask.split('task/')[1],
    });
  }

  /**
   * @param {Object} app
   * @param {Object} options
   * @param {String} vdcInstanceId
   * @param {String} applicationId
   * @return {Promise}
   */
  async getApplicationPortProfile(options, vdcInstanceId, applicationId) {
    const userId = options.user.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    let applicationPortProfile =
      await mainWrapper.user.applicationPortProfile.getApplicationPortProfile(
        session,
        applicationId,
      );
    const ports = applicationPortProfile.applicationPorts.map((ports) => {
      return {
        ports: ports.destinationPorts,
        protocol: ports.protocol,
      };
    });
    applicationPortProfile = {
      id: applicationPortProfile.id,
      name: applicationPortProfile.name,
      description: applicationPortProfile.description,
      applicationPorts: ports,
    };
    return Promise.resolve(applicationPortProfile);
  }

  /**
   * @param {Object} app
   * @param {Object} options
   * @param {String} vdcInstanceId
   * @param {Number} page
   * @param {Number} pageSize
   * @param {String} filter
   * @param {String} search
   * @return {Promise}
   */
  async getApplicationPortProfiles(
    options,
    vdcInstanceId,
    page,
    pageSize,
    filter,
    search,
  ) {
    const userId = options.user.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    if (!isNil(filter)) {
      filter = `((_context==${props['vdcId']}));` + `(${filter})`;
    } else {
      filter = `((_context==${props['vdcId']}))`;
    }
    if (search) {
      filter = filter + `;(name==*${search}*)`;
    }

    console.log(filter, '😊');
    const applicationPortProfiles =
      await mainWrapper.user.applicationPortProfile.getApplicationPortProfileList(
        session,
        {
          page,
          pageSize,
          filter,
        },
      );
    const filteredApplicationPortProfiles =
      applicationPortProfiles.data.values.map((application) => {
        const ports = application.applicationPorts.map((ports) => {
          return {
            ports: ports.destinationPorts,
            protocol: ports.protocol,
          };
        });
        return {
          id: application.id,
          name: application.name,
          applicationPorts: ports,
          scope: application.scope,
        };
      });
    const result: ApplicationProfileListDto = {
      total: applicationPortProfiles.data.resultTotal,
      page: applicationPortProfiles.data.page,
      pageSize: applicationPortProfiles.data.pageSize,
      pageCount: applicationPortProfiles.data.pageCount,
      values: filteredApplicationPortProfiles,
    };
    return result;
  }

  async updateApplicationPortProfile(
    options,
    vdcInstanceId,
    data,
    applicationId,
  ) {
    const userId = options.user.userId;
    const props = await this.servicePropertiesService.getAllServiceProperties(
      vdcInstanceId,
    );
    const vcloudOrg = await this.organizationTable.findById(props['orgId']);
    const session = await this.sessionService.checkUserSession(
      userId,
      props['orgId'],
    );
    const config = {
      orgId: vcloudOrg.orgId,
      vdcId: props['vdcId'],
      applicationPorts: data.applicationPorts,
      name: data.name,
      description: data.description,
    };
    const application =
      await mainWrapper.user.applicationPortProfile.updateApplicationPortProfile(
        session,
        applicationId,
        config,
      );
    await this.logger.info(
      'applicationPortProfiles',
      'updateApplicationPortProfiles',
      {
        _object: application.__vcloudTask.split('task/')[1],
      },
      { ...options.locals },
    );
    return Promise.resolve({
      taskId: application.__vcloudTask.split('task/')[1],
    });
  }

  async getCountOfApplicationPort(
    option: SessionRequest,
    serviceInstanceId: string,
  ): Promise<{ default: number; custom: number }> {
    const customPortFilter = 'TENANT';
    const systemPortFilter = 'SYSTEM';
    const page = 1;
    const pageSize = 1;
    const systemPorts = await this.getApplicationPortProfiles(
      option,
      serviceInstanceId,
      page,
      pageSize,
      `scope==${systemPortFilter}`,
      '',
    );

    const costumePorts = await this.getApplicationPortProfiles(
      option,
      serviceInstanceId,
      page,
      pageSize,
      `scope==${customPortFilter}`,
      '',
    );

    return { default: systemPorts.total, custom: costumePorts.total };
  }
}
