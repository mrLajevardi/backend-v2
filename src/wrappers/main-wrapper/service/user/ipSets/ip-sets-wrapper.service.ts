import { Injectable } from '@nestjs/common';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { EdgeGatewayWrapperService } from '../edgeGateway/edge-gateway-wrapper.service';
import { isEmpty } from 'lodash';
import { NoIpIsAssignedException } from 'src/infrastructure/exceptions/no-ip-is-assigned.exception';

@Injectable()
export class IpSetsWrapperService {
  constructor(
    private readonly vcloudWrapperService: VcloudWrapperService,
    private readonly edgeGatewayWrapperService: EdgeGatewayWrapperService,
  ) {}
  /**
   * create ip set
   * @param {String} authToken
   * @param {String} description
   * @param {String} name
   * @param {Array} ipAddresses
   * @param {String} edgeName
   * @return {Promise}
   */
  async createIPSet(authToken, description, name, ipAddresses, edgeName) {
    const gateway: any = await this.edgeGatewayWrapperService.getEdgeGateway(
      authToken,
    );
    if (isEmpty(gateway.values[0])) {
      return Promise.reject(new NoIpIsAssignedException());
    }
    const gatewayId = gateway.values.filter(
      (value) => value.name === edgeName,
    )[0].id;
    const requestBody = {
      name,
      description,
      ipAddresses,
      ownerRef: {
        id: gatewayId,
      },
      typeValue: 'IP_SET',
    };
    const options = {
      body: requestBody,
      headers: { Authorization: `Bearer ${authToken}` },
    };
    const endpoint = 'IpSetsEndpointService.createIpSetsEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const response = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: response.headers['location'],
    });
  }
  /**
   * @param {String} authToken
   * @param {String} ipSetId
   * @return {Promise}
   */
  async deleteIPSet(authToken, ipSetId) {
    const options = {
      urlParams: { ipSetId },
      headers: { Authorization: `Bearer ${authToken}` },
    };
    const endpoint = 'IpSetsEndpointService.deleteIpSetsEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const response = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: response.headers['location'],
    });
  }
  /**
   * @param {String} authToken
   * @param {Number} page
   * @param {Number} pageSize
   * @param {String} edgeName
   * @param {String} filter
   * @return {Promise}
   */
  async getIPSetsList(authToken, page, pageSize, edgeName, filter = '') {
    const gateway: any = await this.edgeGatewayWrapperService.getEdgeGateway(
      authToken,
    );
    if (isEmpty(gateway.values[0])) {
      return Promise.reject(new NoIpIsAssignedException());
    }
    const gatewayId = gateway.values.filter(
      (value) => value.name === edgeName,
    )[0].id;
    const endpoint = 'IpSetsEndpointService.getIpSetsListEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const response = await this.vcloudWrapperService.request(
      wrapper({
        params: {
          page,
          pageSize,
          filter: `((ownerRef.id==${gatewayId};typeValue==IP_SET))` + filter,
          sortAsc: 'name',
        },
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    );
    return Promise.resolve(response.data);
  }
  /**
   *
   * @param {String} authToken
   * @param {String} ipSetId
   * @return {Promise}
   */
  async getSingleIPSet(authToken, ipSetId) {
    const endpoint = 'IpSetsEndpointService.getIpSetsEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const ipSet = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { ipSetId },
      }),
    );
    return Promise.resolve(ipSet.data);
  }
  /**
   *
   * @param {String} authToken
   * @param {String} description
   * @param {String} name
   * @param {String} ipAddresses
   * @param {String} ipSetId
   * @param {String} edgeName
   * @return {Promise}
   */
  async updateIPSet(
    authToken,
    description,
    name,
    ipAddresses,
    ipSetId,
    edgeName,
  ) {
    const gateway: any = await this.edgeGatewayWrapperService.getEdgeGateway(
      authToken,
    );
    if (isEmpty(gateway.values[0])) {
      return Promise.reject(new NoIpIsAssignedException());
    }
    const gatewayId = gateway.values.filter(
      (value) => value.name === edgeName,
    )[0].id;
    const requestBody = {
      name,
      description,
      ipAddresses,
      ownerRef: {
        id: gatewayId,
      },
      typeValue: 'IP_SET',
    };
    const endpoint = 'IpSetsEndpointService.updateIpSetsEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const ipSet = await this.vcloudWrapperService.request(
      wrapper({
        urlParams: { ipSetId },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: requestBody,
      }),
    );
    return Promise.resolve({
      __vcloudTask: ipSet.headers['location'],
    });
  }
}
