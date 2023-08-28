import { Injectable } from '@nestjs/common';
import {
  CreateApplicationPortProfileInterface,
  CreateApplicationPortProfileDto,
} from './interface/createApplicationPortProfile.interface';
import { VcloudWrapperService } from '../../../../vcloud-wrapper/services/vcloud-wrapper.service';
import { DeleteApplicationPortProfileDto } from './interface/deleteApplicationPortProfile.interface';

@Injectable()
export class ApplicationPortProfileWrapperService {
  constructor(private readonly vcloudWrapperService: VcloudWrapperService) {}
  async createApplicationPortProfile(
    authToken: string,
    config: CreateApplicationPortProfileInterface,
  ): Promise<CreateApplicationPortProfileDto> {
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
  ): Promise<DeleteApplicationPortProfileDto> {
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
  /**
   * @param {String} authToken
   * @param {String} params
   * @return {Promise}
   */
  async getApplicationPortProfiles(authToken, params) {
    const endpoint =
      'ApplicationPortProfileEndpointService.getApplicationPortProfilesListEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const applicationPortProfile = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        params,
      }),
    );
    return applicationPortProfile;
  }
  /**
   *
   * @param {String} authToken
   * @param {String} applicationId
   * @return {Promise}
   */
  async getSingleApplicationPortProfile(authToken, applicationId) {
    const options = {
      headers: { Authorization: `Bearer ${authToken}` },
      urlParams: { applicationId },
    };
    const endpoint =
      'ApplicationPortProfileEndpointService.getApplicationPortProfileEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const applicationPortProfile = await this.vcloudWrapperService.request(
      wrapper(options),
    );
    return Promise.resolve(applicationPortProfile.data);
  }
  /**
   * @param {String} authToken
   * @param {String} applicationId
   * @param {Object} config
   * @param {Object} config.description
   * @param {Object} config.name
   * @param {Object} config.vdcId
   * @param {Object} config.orgId
   * @param {Object} config.applicationPorts
   * @return {Promise}
   */
  async updateApplicationPortProfile(authToken, applicationId, config) {
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
