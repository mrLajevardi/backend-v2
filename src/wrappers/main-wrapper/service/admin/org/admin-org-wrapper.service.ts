import { Injectable } from '@nestjs/common';
import { vcdConfig } from 'src/wrappers/main-wrapper/vcdConfig';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';

@Injectable()
export class AdminOrgWrapperService {
  constructor(private readonly vcloudWrapperService: VcloudWrapperService) {}
  async createOrg(name, authToken) {
    const requestBody = {
      ...vcdConfig.admin.org,
      name: name,
      displayName: name,
    };
    const options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: requestBody,
    };
    const endpoint = 'AdminOrgEndpointService.createOrgEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const response: any = await this.vcloudWrapperService.request(
      wrapper(options),
    );
    return Promise.resolve({
      id: response.data.id,
      name: response.data.name,
      __vcloudTask: response.headers['location'],
    });
  }
  /**
   *
   * @param {String} authToken
   * @param {String} description
   * @param {String} name
   * @param {String} orgId
   * @return {Promise}
   */
  async createOrgCatalog(authToken, description, name = 'user-catalog', orgId) {
    const requestBody = {
      name,
      description,
    };
    const filteredOrgId = orgId.split('org:')[1];
    const options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      urlParams: { orgId: filteredOrgId },
      body: requestBody,
    };
    const endpoint = 'AdminOrgEndpointService.createOrgCatalogEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve();
  }
  /**
   * @param {String} session
   * @param {String} catalogId
   * @return {void}
   */
  deleteCatalog(session, catalogId) {
    const options = {
      headers: { Authorization: `Bearer ${session}` },
      urlParams: { catalogId: catalogId },
    };
    const endpoint = 'AdminOrgEndpointService.deleteOrgCatalogEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    return this.vcloudWrapperService.request(wrapper(options));
  }
  /**
   * @param {String} params
   * @param {String} authToken
   * @return {Promise}
   */
  async getOrg(params, authToken) {
    const options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      params,
    };
    const endpoint = 'AdminOrgEndpointService.getOrgEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const response = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve(response.data);
  }
}
