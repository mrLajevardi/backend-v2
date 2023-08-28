import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { NoIpIsAssignedException } from 'src/infrastructure/exceptions/no-ip-is-assigned.exception';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';

@Injectable()
export class EdgeGatewayWrapperService {
  constructor(private readonly vcloudWrapperService: VcloudWrapperService) {}
  /**
   * @param {String} authToken
   * @param {Number} page
   * @param {Number} pageSize
   * @return {Promise}
   */
  async getEdgeGateway(authToken, page = 1, pageSize = 25) {
    const options = {
      params: {
        page,
        pageSize,
      },
      headers: { Authorization: `Bearer ${authToken}` },
    };
    const endpoint = 'EdgeGatewayEndpointService.getEdgeGatewayEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const edgeGateways = await this.vcloudWrapperService.request(
      wrapper(options),
    );
    return Promise.resolve(edgeGateways.data);
  }

  /**
   * get dns forwarder lists
   * @param {String} authToken
   * @param {String} edgeName
   * @return {Promise}
   */

  async getDhcpForwarder(authToken, edgeName) {
    const gateway: any = await this.getEdgeGateway(authToken);

    if (isEmpty(gateway.values[0])) {
      return Promise.reject(new NoIpIsAssignedException());
    }
    const gatewayId = gateway.values.filter(
      (value) => value.name === edgeName,
    )[0].id;
    const endpoint = 'EdgeGatewayEndpointService.getDhcpForwarderEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const dhcpForwarder = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { gatewayId },
      }),
    );
    return Promise.resolve(dhcpForwarder.data);
  }
  /**
   * get dns forwarder lists
   * @param {String} authToken
   * @param {String} edgeName
   * @return {Promise}
   */

  async getDnsForwarder(authToken, edgeName) {
    const gateway: any = await this.getEdgeGateway(authToken);

    if (isEmpty(gateway.values[0])) {
      return Promise.reject(new NoIpIsAssignedException());
    }
    const gatewayId = gateway.values.filter(
      (value) => value.name === edgeName,
    )[0].id;
    const endpoint = 'EdgeGatewayEndpointService.getDnsForwarderEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const dns = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { gatewayId },
      }),
    );
    return Promise.resolve(dns.data);
  }
  /**
   * @param {Array} dhcpServers
   * @param {Boolean} enabled
   * @param {object} version
   * @param {string} edgeName
   * @param {string} authToken
   * @return {Promise}
   */
  async updateDhcpForwarder(
    dhcpServers,
    enabled,
    version,
    edgeName,
    authToken,
  ) {
    const gateway: any = await this.getEdgeGateway(authToken);
    const gatewayId = gateway.values.filter(
      (value) => value.name === edgeName,
    )[0].id;
    const request = {
      enabled,
      dhcpServers,
      version,
    };
    const options = {
      body: request,
      urlParams: {
        gatewayId,
      },
      headers: { Authorization: `Bearer ${authToken}` },
    };
    const endpoint = 'EdgeGatewayEndpointService.updateDhcpForwarderEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const dhcpForwarder = await this.vcloudWrapperService.request(
      wrapper(options),
    );
    return Promise.resolve({
      __vcloudTask: dhcpForwarder.headers['location'],
    });
  }
  /**
 * update dns forwarder
 * @param {Object} config
 * @param {Boolean} config.enabled
 * @param {Array} config.upstreamServers
 * @param {String} config.displayName
 * @param {String} config.authToken
//  * @param {String} config.ruleId
 * @param {String} edgeName edgeGateway name
 */
  async updateDnsForwarder(config, edgeName) {
    const gateway: any = await this.getEdgeGateway(config.authToken);
    const gatewayId = gateway.values.filter(
      (value) => value.name === edgeName,
    )[0].id;
    const request = {
      enabled: config.enabled,
      listenerIp: null,
      defaultForwarderZone: {
        displayName: config.displayName,
        upstreamServers: config.upstreamServers,
      },
      conditionalForwarderZones: null,
      version: null,
      snatRuleEnabled: null,
    };
    const options = {
      body: request,
      urlParams: {
        gatewayId,
      },
      headers: { Authorization: `Bearer ${config.authToken}` },
    };
    const endpoint = 'EdgeGatewayEndpointService.updateDnsForwarderEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const dnsForwarder = await this.vcloudWrapperService.request(
      wrapper(options),
    );
    return Promise.resolve({
      __vcloudTask: dnsForwarder.headers['location'],
    });
  }
}
