import { Injectable } from '@nestjs/common';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { EdgeGatewayWrapperService } from '../edgeGateway/edge-gateway-wrapper.service';
import { isEmpty } from 'lodash';
import { NoIpIsAssignedException } from 'src/infrastructure/exceptions/no-ip-is-assigned.exception';

@Injectable()
export class FirewallWrapperService {
  constructor(
    private readonly vcloudWrapperService: VcloudWrapperService,
    private readonly edgeGatewayWrapperService: EdgeGatewayWrapperService,
  ) {}
  /**
   *
   * @param {String} authToken
   * @param {String} ruleId
   * @param {String} edgeName
   */
  async deleteFirewall(authToken, ruleId, edgeName) {
    const gateway: any = await this.edgeGatewayWrapperService.getEdgeGateway(
      authToken,
    );
    if (isEmpty(gateway.values[0])) {
      return Promise.reject(new NoIpIsAssignedException());
    }
    const gatewayId = gateway.values.filter(
      (value) => value.name === edgeName,
    )[0].id;
    const endpoint = 'FirewallEndpointService.deleteFirewallEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const firewall = await this.vcloudWrapperService.request(
      wrapper({
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        urlParams: {
          gatewayId,
          ruleId,
        },
      }),
    );
    return Promise.resolve({
      __vcloudTask: firewall.headers['location'],
    });
  }
  /**
   * get a list of firewall rules
   * @param {String} authToken
   * @param {String} edgeName
   */
  async getFirewallList(authToken, edgeName) {
    const gateway: any = await this.edgeGatewayWrapperService.getEdgeGateway(
      authToken,
    );
    if (isEmpty(gateway.values[0])) {
      return Promise.reject(new NoIpIsAssignedException());
    }
    const gatewayId = gateway.values.filter(
      (value) => value.name === edgeName,
    )[0].id;
    const endpoint = 'FirewallEndpointService.getFirewallListEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const firewall = await this.vcloudWrapperService.request(
      wrapper({
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        urlParams: { gatewayId },
      }),
    );
    return Promise.resolve(firewall.data);
  }
  /**
   * get a single firewall rule
   * @param {String} authToken
   * @param {String} ruleId
   * @param {String} edgeName
   * @return {Promise}
   */
  async getSingleFirewall(authToken, ruleId, edgeName) {
    const gateway: any = await this.edgeGatewayWrapperService.getEdgeGateway(
      authToken,
    );

    if (isEmpty(gateway.values[0])) {
      return Promise.reject(new NoIpIsAssignedException());
    }
    const gatewayId = gateway.values.filter(
      (value) => value.name === edgeName,
    )[0].id;

    if (ruleId === 'default_rule') {
      ruleId = '';
    }
    const endpoint = 'FirewallEndpointService.getFirewallEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const firewall: any = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: {
          gatewayId,
          ruleId,
        },
      }),
    );
    if (ruleId === '') {
      return Promise.resolve(firewall.data.defaultRules[0]);
    }
    return Promise.resolve(firewall.data);
  }
  /**
   * update all firewall rules
   * @param {String} authToken
   * @param {Object} config
   * @param {String} edgeName
   * @return {Promise}
   */
  async updateFirewallList(authToken, config, edgeName) {
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
      userDefinedRules: config,
    };
    const endpoint = 'FirewallEndpointService.updateFirewallListEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const firewall = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { gatewayId },
        body: requestBody,
      }),
    );
    return Promise.resolve({
      __vcloudTask: firewall.headers['location'],
    });
  }
  /**
   *
   * @param {String} authToken
   * @param {String} ruleId
   * @param {Object} config
   * @param {String} edgeName
   * @return {Promise}
   */
  async updateSingleFirewall(authToken, ruleId, config, edgeName) {
    const gateway: any = await this.edgeGatewayWrapperService.getEdgeGateway(
      authToken,
    );
    if (isEmpty(gateway.values[0])) {
      return Promise.reject(new NoIpIsAssignedException());
    }
    const gatewayId = gateway.values.filter(
      (value) => value.name === edgeName,
    )[0].id;
    const endpoint = 'FirewallEndpointService.updateFirewallEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const firewall = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: {
          gatewayId,
          ruleId,
        },
        body: config,
      }),
    );
    return Promise.resolve({
      __vcloudTask: firewall.headers['location'],
    });
  }
}
