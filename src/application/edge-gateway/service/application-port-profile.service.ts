import { Injectable } from '@nestjs/common';
import { SessionsService } from '../../base/sessions/sessions.service';
import { OrganizationTableService } from '../../base/crud/organization-table/organization-table.service';
import { mainWrapper } from 'src/wrappers/mainWrapper/mainWrapper';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { isNil } from 'lodash';
import {
  ApplicationProfileListDto,
  ApplicationProfileListQueryDto,
} from '../dto/application-profile-list.dto';
import { ServicePropertiesService } from 'src/application/base/service-properties/service-properties.service';
import { SessionRequest } from '../../../infrastructure/types/session-request.type';
import { ApplicationPortProfileWrapperService } from 'src/wrappers/main-wrapper/service/user/applicationPortProfile/application-port-profile-wrapper.service';
import { VdcProperties } from 'src/application/vdc/interface/vdc-properties.interface';
import { CreateApplicationPortProfileDto } from '../dto/create-application-port-profile.dto';
import { TaskReturnDto } from 'src/infrastructure/dto/task-return.dto';
import { ApplicationPortProfileListValuesDto } from '../dto/application-port-profile-list-values.dto';

@Injectable()
export class ApplicationPortProfileService {
  constructor(
    private readonly logger: LoggerService,
    private readonly servicePropertiesService: ServicePropertiesService,
    private readonly sessionService: SessionsService,
    private readonly organizationTable: OrganizationTableService,
    private readonly applicationPortProfileWrapperService: ApplicationPortProfileWrapperService,
  ) {}

  async createApplicationPortProfile(
    options: SessionRequest,
    vdcInstanceId: string,
    data: CreateApplicationPortProfileDto,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props =
      await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
        vdcInstanceId,
      );
    const vcloudOrg = await this.organizationTable.findById(
      Number(props['orgId']),
    );
    const session = await this.sessionService.checkUserSession(
      userId,
      Number(props['orgId']),
    );
    const config = {
      orgId: vcloudOrg.orgId,
      vdcId: props['vdcId'],
      applicationPorts: data.applicationPorts,
      name: data.name,
      description: data.description,
    };
    const application =
      await this.applicationPortProfileWrapperService.createApplicationPortProfile(
        session,
        config,
      );
    return Promise.resolve({
      taskId: application.__vcloudTask.split('task/')[1],
    });
  }
  async deleteApplicationPortProfile(
    options: SessionRequest,
    vdcInstanceId: string,
    applicationId: string,
  ): Promise<TaskReturnDto> {
    const userId = options.user.userId;
    const props =
      await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
        vdcInstanceId,
      );
    const session = await this.sessionService.checkUserSession(
      userId,
      Number(props['orgId']),
    );
    const application =
      await this.applicationPortProfileWrapperService.deleteApplicationPortProfile(
        session,
        applicationId,
      );
    return Promise.resolve({
      taskId: application.__vcloudTask.split('task/')[1],
    });
  }

  async getApplicationPortProfile(
    options: SessionRequest,
    vdcInstanceId: string,
    applicationId: string,
  ): Promise<ApplicationPortProfileListValuesDto> {
    const userId = options.user.userId;
    const props =
      await this.servicePropertiesService.getAllServiceProperties<VdcProperties>(
        vdcInstanceId,
      );
    const session = await this.sessionService.checkUserSession(
      userId,
      Number(props['orgId']),
    );
    const applicationPortProfile =
      await this.applicationPortProfileWrapperService.getSingleApplicationPortProfile(
        session,
        applicationId,
      );
    const ports = applicationPortProfile.applicationPorts.map((ports) => {
      return {
        ports: ports.destinationPorts,
        protocol: ports.protocol,
        name: ports.name,
      };
    });
    const result: ApplicationPortProfileListValuesDto = {
      id: applicationPortProfile.id,
      name: applicationPortProfile.name,
      applicationPortProfile: ports,
      scope: applicationPortProfile.scope,
    };
    return Promise.resolve(result);
  }

  async getApplicationPortProfiles(
    options: SessionRequest,
    vdcInstanceId: string,
    query: ApplicationProfileListQueryDto,
  ): Promise<ApplicationProfileListDto> {
    const userId = options.user.userId;
    const { page, pageSize, search } = query;
    let { filter } = query;
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
    const applicationPortProfiles =
      await this.applicationPortProfileWrapperService.getApplicationPortProfiles(
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
          applicationPortProfile: ports,
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
    options: SessionRequest,
    vdcInstanceId: string,
    data: CreateApplicationPortProfileDto,
    applicationId: string,
  ): Promise<TaskReturnDto> {
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
      { page, pageSize, filter: `scope==${systemPortFilter}` },
    );

    const costumePorts = await this.getApplicationPortProfiles(
      option,
      serviceInstanceId,
      { page, pageSize, filter: `scope==${customPortFilter}` },
    );

    return { default: systemPorts.total, custom: costumePorts.total };
  }
}
