import { Injectable } from "@nestjs/common";
import { ServiceService } from "../base/service/services/service.service";
import { SessionsService } from "../base/sessions/sessions.service";
import { OrganizationTableService } from "../base/crud/organization-table/organization-table.service";
import { mainWrapper } from "src/wrappers/mainWrapper/mainWrapper";
import { LoggerService } from "src/infrastructure/logger/logger.service";
import { isNil } from "lodash";

@Injectable()
export class ApplicationPortProfileService {
  constructor(
    private readonly logger: LoggerService,
    private readonly serviceService: ServiceService,
    private readonly sessionService: SessionsService,
    private readonly organizationTable: OrganizationTableService
  ) {}

  /**
   * @param {Object} app
   * @param {Object} options
   * @param {String} vdcInstanceId
   * @param {Object} data
   * @return {Promise}
   */
  async createApplicationPortProfile(options, vdcInstanceId, data) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(
      vdcInstanceId
    );
    const vcloudOrg = await this.organizationTable.findById(props["orgId"]);
    const session = await this.sessionService.checkUserSession(
      userId,
      props["orgId"]
    );
    const config = {
      orgId: vcloudOrg.orgId,
      vdcId: props["vdcId"],
      applicationPorts: data.applicationPorts,
      name: data.name,
      description: data.description,
    };
    const application =
      await mainWrapper.user.applicationPortProfile.createApplicationPortProfile(
        session,
        config
      );
    await this.logger.info(
      "applicationPortProfiles",
      "createApplicationPortProfiles",
      {
        _object: application.__vcloudTask.split("task/")[1],
      },
      { ...options.locals }
    );
    return Promise.resolve({
      taskId: application.__vcloudTask.split("task/")[1],
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
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(
      vdcInstanceId
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props["orgId"]
    );
    const application =
      await mainWrapper.user.applicationPortProfile.deleteApplicationPortProfile(
        session,
        applicationId
      );
    await this.logger.info(
      "applicationPortProfiles",
      "deleteApplicationPortProfiles",
      {
        _object: application.__vcloudTask.split("task/")[1],
      },
      { ...options.locals }
    );
    return Promise.resolve({
      taskId: application.__vcloudTask.split("task/")[1],
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
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(
      vdcInstanceId
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props["orgId"]
    );
    let applicationPortProfile =
      await mainWrapper.user.applicationPortProfile.getApplicationPortProfile(
        session,
        applicationId
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
    search
  ) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(
      vdcInstanceId
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      props["orgId"]
    );
    if (!isNil(filter)) {
      filter = `((_context==${props["vdcId"]}));` + `(${filter})`;
    } else {
      filter = `((_context==${props["vdcId"]}))`;
    }
    if (search) {
      filter = filter + `;(name==*${search}*)`;
    }
    let applicationPortProfiles =
      await mainWrapper.user.applicationPortProfile.getApplicationPortProfileList(
        session,
        {
          page,
          pageSize,
          filter,
        }
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
    const result = {
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
    applicationId
  ) {
    const userId = options.accessToken.userId;
    const props = await this.serviceService.getAllServiceProperties(
      vdcInstanceId
    );
    const vcloudOrg = await this.organizationTable.findById(props["orgId"]);
    const session = await this.sessionService.checkUserSession(
      userId,
      props["orgId"]
    );
    const config = {
      orgId: vcloudOrg.orgId,
      vdcId: props["vdcId"],
      applicationPorts: data.applicationPorts,
      name: data.name,
      description: data.description,
    };
    const application =
      await mainWrapper.user.applicationPortProfile.updateApplicationPortProfile(
        session,
        applicationId,
        config
      );
    await this.logger.info(
      "applicationPortProfiles",
      "updateApplicationPortProfiles",
      {
        _object: application.__vcloudTask.split("task/")[1],
      },
      { ...options.locals }
    );
    return Promise.resolve({
      taskId: application.__vcloudTask.split("task/")[1],
    });
  }
}
