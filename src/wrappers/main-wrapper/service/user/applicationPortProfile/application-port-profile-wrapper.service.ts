import { Injectable } from '@nestjs/common';
import { CreateApplicationPortProfileInterface } from './interface/createApplicationPortProfile.interface';
import { VcloudWrapperService } from '../../../../vcloud-wrapper/services/vcloud-wrapper.service';
import { VcloudTask } from 'src/infrastructure/dto/vcloud-task.dto';
import { GetApplicationPortProfilesParams } from 'src/wrappers/vcloud-wrapper/services/user/edgeGateway/applicationPortProfile/dto/get-application-port-profiles-list.dto';
import { GetApplicationPortProfileListDto } from './dto/get-application-port-profile-list.dto';
import { AxiosResponse } from 'axios';
import { GetApplicationPortProfileDto } from './dto/get-application-port-profile.dto';
import { UpdateApplicationPortProfileConfig } from './dto/update-application-port-profile.dto';

@Injectable()
export class ApplicationPortProfileWrapperService {
  constructor(private readonly vcloudWrapperService: VcloudWrapperService) {}
  async createApplicationPortProfile(
    authToken: string,
    config: CreateApplicationPortProfileInterface,
  ): Promise<VcloudTask> {
    const requestBody = {
      name: config.name,
      description: config.description,
      applicationPorts: config.applicationPorts,
      orgRef: {
        id: config.orgId,
      },
      contextEntityId: config.vdcId,
      scope: 'TENANT',
    };
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      body: requestBody,
    };
    const endpoint =
      'ApplicationPortProfileEndpointService.createApplicationPortProfilesEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const applicationPortProfile = await this.vcloudWrapperService.request(
      wrapper(options),
    );
    return Promise.resolve({
      __vcloudTask: applicationPortProfile.headers.location,
    });
  }
  async deleteApplicationPortProfile(
    authToken: string,
    applicationId: string,
  ): Promise<VcloudTask> {
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { applicationId },
    };
    const endpoint =
      'ApplicationPortProfileEndpointService.deleteApplicationPortProfilesEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const applicationPortProfile = await this.vcloudWrapperService.request(
      wrapper(options),
    );
    return Promise.resolve({
      __vcloudTask: applicationPortProfile.headers['location'],
    });
  }

  async getApplicationPortProfiles(
    authToken: string,
    params: GetApplicationPortProfilesParams,
  ): Promise<AxiosResponse<GetApplicationPortProfileListDto, any>> {
    const endpoint =
      'ApplicationPortProfileEndpointService.getApplicationPortProfilesListEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const applicationPortProfile =
      await this.vcloudWrapperService.request<GetApplicationPortProfileListDto>(
        wrapper({
          headers: { Authorization: `Bearer ${authToken}` },
          params,
        }),
      );
    return applicationPortProfile;
  }

  async getSingleApplicationPortProfile(
    authToken: string,
    applicationId: string,
  ): Promise<GetApplicationPortProfileDto> {
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { applicationId },
    };
    const endpoint =
      'ApplicationPortProfileEndpointService.getApplicationPortProfileEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const applicationPortProfile =
      await this.vcloudWrapperService.request<GetApplicationPortProfileDto>(
        wrapper(options),
      );
    return Promise.resolve(applicationPortProfile.data);
  }
  async updateApplicationPortProfile(
    authToken: string,
    applicationId: string,
    config: UpdateApplicationPortProfileConfig,
  ): Promise<VcloudTask> {
    const requestBody = {
      name: config.name,
      description: config.description,
      applicationPorts: config.applicationPorts,
      orgRef: {
        id: config.orgId,
      },
      contextEntityId: config.vdcId,
      scope: 'TENANT',
    };
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { applicationId },
      body: requestBody,
    };
    const endpoint =
      'ApplicationPortProfileEndpointService.updateApplicationPortProfilesEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const response = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: response.headers['location'],
    });
  }
}
