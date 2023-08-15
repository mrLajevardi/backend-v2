import { Injectable } from '@nestjs/common';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { EdgeGatewayWrapperService } from '../edgeGateway/edge-gateway-wrapper.service';
import { isEmpty } from 'lodash';
import { NoIpIsAssignedException } from 'src/infrastructure/exceptions/no-ip-is-assigned.exception';

@Injectable()
export class DhcpWrapperService {
  constructor(
    private readonly vcloudWrapperService: VcloudWrapperService,
    private readonly edgeGatewayWrapperService: EdgeGatewayWrapperService,
  ) {}
  /**
   * creates dhcp binding
   * @param {String} authToken
   * @param {String} networkId
   * @param {Object} config
   * @param {String} config.name
   * @param {String} config.ipAddress
   * @param {String} config.description
   * @param {String} config.macAddress
   * @param {Number} config.leaseTime in seconds
   * @param {Array<String>} config.dnsServers
   * @param {Object} config.dhcpV4BindingConfig
   * @param {String} config.dhcpV4BindingConfig.gatewayIpAddress
   * @param {String} config.dhcpV4BindingConfig.hostName
   * @return {Promise}
   */
  async createDhcpBinding(authToken, networkId, config) {
    const endpoint = 'DhcpEndpointService.createDhcpBindingEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const dhcp = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: {
          networkId,
        },
        body: {
          bindingType: 'IPV4',
          name: config.name,
          description: config.description,
          leaseTime: config.leaseTime,
          macAddress: config.macAddress,
          ipAddress: config.ipAddress,
          dnsServers: config.dnsServers,
          dhcpV4BindingConfig: config.dhcpV4BindingConfig,
        },
      }),
    );
    return Promise.resolve({
      __vcloudTask: dhcp.headers['location'],
    });
  }
  /**
   * deletes dhcp
   * @param {String} authToken
   * @param {String} networkId
   * @return {Promise}
   */
  async deleteDhcp(authToken, networkId) {
    const endpoint = 'DhcpEndpointService.deleteDhcpEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const dhcp = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: {
          networkId,
        },
      }),
    );
    return Promise.resolve({
      __vcloudTask: dhcp.headers['location'],
    });
  }
  /**
   * deletes dhcp
   * @param {String} authToken
   * @param {String} networkId
   * @param {String} bindingId
   * @return {Promise}
   */
  async deleteDhcpBinding(authToken, networkId, bindingId) {
    const endpoint = 'DhcpEndpointService.deleteDhcpBindingsEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const dhcp = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: {
          networkId,
          bindingId,
        },
      }),
    );
    return Promise.resolve({
      __vcloudTask: dhcp.headers['location'],
    });
  }
  /**
   * gets a dhcp binding
   * @param {String} authToken
   * @param {String} networkId
   * @param {Number} pageSize
   * @param {String} cursor
   * @return {Promise}
   */
  async getAllDhcpBindings(authToken, networkId, pageSize, cursor = '') {
    const endpoint = 'DhcpEndpointService.getAllDhcpBindingEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const dhcp = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: {
          networkId,
        },
        params: {
          pageSize,
          cursor,
        },
      }),
    );
    return Promise.resolve(dhcp);
  }
  /**
   * get dhcp
   * @param {String} authToken
   * @param {String} networkId
   * @return {Promise}
   */
  async getDhcp(authToken, networkId) {
    const endpoint = 'DhcpEndpointService.getDhcpEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const dhcp = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: {
          networkId,
        },
      }),
    );
    return Promise.resolve(dhcp.data);
  }
  /**
   * gets a dhcp binding
   * @param {String} authToken
   * @param {String} networkId
   * @param {Number} bindingId
   * @return {Promise}
   */
  async getDhcpBinding(authToken, networkId, bindingId) {
    const endpoint = 'DhcpEndpointService.getDhcpBindingEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const dhcp = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: {
          networkId,
          bindingId,
        },
      }),
    );
    return Promise.resolve(dhcp.data);
  }
  /**   
 * update dhcp
 * @param {String} authToken
 * @param {Array<Object>} dhcpPools eg:
    [{
    enabled: true,
        ipRange: {
            startAddress: 192.168.1.1,
            endAddress: 192.168.1.2
        }
    }]
 * @param {String} ipAddress ipAddress of gateway cidr
 * @param {Array} dnsServers  list of dns servers limit: 2
 * @param {Number} leaseTime  How long a DHCP IP will be leased out for
 * @param {String} networkId
 * @param {String} mode  EDGE, NETWORK and RELAY
 * @return {Promise}
 */
  async updateDhcp(
    authToken,
    dhcpPools,
    ipAddress,
    dnsServers,
    leaseTime,
    networkId,
    mode,
  ) {
    const gateway: any = await this.edgeGatewayWrapperService.getEdgeGateway(
      authToken,
      1,
      10,
    );
    if (isEmpty(gateway.values[0])) {
      return Promise.reject(new NoIpIsAssignedException());
    }
    const endpoint = 'DhcpEndpointService.updateDhcpEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const dhcp = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: {
          networkId,
        },
        body: {
          mode,
          ipAddress,
          leaseTime,
          enabled: true,
          dhcpPools,
          dnsServers,
        },
      }),
    );
    return Promise.resolve({
      __vcloudTask: dhcp.headers['location'],
    });
  }
  /**
   * creates dhcp binding
   * @param {String} authToken
   * @param {String} networkId
   * @param {Object} config
   * @param {String} config.name
   * @param {Object} config.version
   * @param {Number} config.version.version
   * @param {String} config.ipAddress
   * @param {String} config.description
   * @param {String} config.macAddress
   * @param {Number} config.leaseTime in seconds
   * @param {Array<String>} config.dnsServers
   * @param {Object} config.dhcpV4BindingConfig
   * @param {String} config.dhcpV4BindingConfig.gatewayIpAddress
   * @param {String} config.dhcpV4BindingConfig.hostName
   * @param {String} bindingId
   * @return {Promise}
   */
  async updateDhcpBinding(authToken, networkId, config, bindingId) {
    const endpoint = 'DhcpEndpointService.updateDhcpBindingEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const dhcp = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: {
          networkId,
          bindingId,
        },
        body: {
          id: bindingId,
          bindingType: 'IPV4',
          name: config.name,
          description: config.description,
          leaseTime: config.leaseTime,
          macAddress: config.macAddress,
          ipAddress: config.ipAddress,
          dnsServers: config.dnsServers,
          dhcpV4BindingConfig: config.dhcpV4BindingConfig,
          version: config.version,
        },
      }),
    );
    return Promise.resolve({
      __vcloudTask: dhcp.headers['location'],
    });
  }
}
