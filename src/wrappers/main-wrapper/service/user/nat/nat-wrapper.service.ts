import { Injectable } from '@nestjs/common';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { EdgeGatewayWrapperService } from '../edgeGateway/edge-gateway-wrapper.service';
import { isEmpty } from 'lodash';
import { NoIpIsAssignedException } from 'src/infrastructure/exceptions/no-ip-is-assigned.exception';

@Injectable()
export class NatWrapperService {
  constructor(
    private readonly vcloudWrapperService: VcloudWrapperService,
    private readonly edgeGatewayWrapperService: EdgeGatewayWrapperService,
  ) {}

  /**
   *
   * @param {Object} config
   * @param {String} edgeName
   * @param {String} config.authToken
   * @param {String} config.name
   * @param {String} config.dnatExternalPort
   * @param {String} config.externalAddresses
   * @param {String} config.internalAddresses
   * @param {String} config.internalPort
   * @param {String} config.snatDestinationAddresses
   * @param {Object} config.applicationPortProfile
   * @param {String} config.type
   * @param {String} config.enabled
   */
  async createNatRule(config, edgeName) {
    const gateway: any = await this.edgeGatewayWrapperService.getEdgeGateway(
      config.authToken,
    );
    if (isEmpty(gateway.values[0])) {
      return Promise.reject(new NoIpIsAssignedException());
    }
    const gatewayId = gateway.values.filter(
      (value) => value.name === edgeName,
    )[0].id;
    const request = {
      enabled: config.enabled,
      dnatExternalPort: config.dnatExternalPort,
      externalAddresses: config.externalAddresses,
      internalAddresses: config.internalAddresses,
      internalPort: config.internalPort,
      name: config.name,
      snatDestinationAddresses: config.snatDestinationAddresses,
      applicationPortProfile: config.applicationPortProfile,
      type: config.type,
      logging: config.logging,
      priority: config.priority,
      description: config.description,
      firewallMatch: config.firewallMatch,
    };
    const options = {
      headers: { Authorization: `Bearer ${config.authToken}` },
      body: request,
      urlParams: { gatewayId },
    };
    const endpoint = 'NatEndpointService.createNatEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const nat = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: nat.headers['location'],
    });
  }
  /**
   * @param {Object} authToken
   * @param {String} ruleId,
   * @param {String} edgeName,
   * @return {Promise}
   */
  async deleteNatRule(authToken, ruleId, edgeName) {
    const gateway: any = await this.edgeGatewayWrapperService.getEdgeGateway(
      authToken,
    );
    const gatewayId = gateway.values.filter(
      (value) => value.name === edgeName,
    )[0].id;
    const options = {
      urlParams: {
        gatewayId,
        natId: ruleId,
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    const endpoint = 'NatEndpointService.deleteNatEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const deletedNat = await this.vcloudWrapperService.request(
      wrapper(options),
    );
    return Promise.resolve({
      __vcloudTask: deletedNat.headers['location'],
    });
  }
  /**
   * get a single nat rule
   * @param {String} authToken
   * @param {String} ruleId
   * @param {String} edgeName edgeGateway name
   * @return {Promise}
   */
  async getNatRule(authToken, ruleId, edgeName) {
    const gateway: any = await this.edgeGatewayWrapperService.getEdgeGateway(
      authToken,
    );
    if (isEmpty(gateway.values[0])) {
      return Promise.reject(new NoIpIsAssignedException());
    }
    const gatewayId = gateway.values.filter(
      (value) => value.name === edgeName,
    )[0].id;
    const options = {
      urlParams: {
        gatewayId,
        natId: ruleId,
      },
      headers: { Authorization: `Bearer ${authToken}` },
    };
    const endpoint = 'NatEndpointService.getNatEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const natRule = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve(natRule.data);
  }
  /**
   * get a list of nats
   * @param {String} authToken
   * @param {Number} pageSize
   * @param {String} cursor
   * @param {String} edgeName
   * @return {Promise}
   */
  async getNatRuleList(authToken, pageSize = 1, cursor = '', edgeName) {
    const gateway: any = await this.edgeGatewayWrapperService.getEdgeGateway(
      authToken,
    );
    if (isEmpty(gateway.values[0])) {
      return Promise.reject(new NoIpIsAssignedException());
    }
    const gatewayId = gateway.values.filter(
      (value) => value.name === edgeName,
    )[0].id;
    const params = {
      pageSize,
      cursor,
    };
    const endpoint = 'NatEndpointService.getNatListEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const natRules = await this.vcloudWrapperService.request(
      wrapper({
        params,
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { gatewayId },
      }),
    );
    return Promise.resolve(natRules);
  }
  /**
   * update nat rule
   * @param {Object} config
   * @param {String} config.authToken
   * @param {String} config.ruleId
   * @param {String} config.name
   * @param {String} config.dnatExternalPort
   * @param {String} config.externalAddresses
   * @param {String} config.internalAddresses
   * @param {String} config.internalPort
   * @param {String} config.snatDestinationAddresses
   * @param {Object} config.applicationPortProfile
   * @param {String} config.type
   * @param {String} edgeName edgeGateway name
   */
  async updateNatRule(config, edgeName) {
    const gateway: any = await this.edgeGatewayWrapperService.getEdgeGateway(
      config.authToken,
    );
    const gatewayId = gateway.values.filter(
      (value) => value.name === edgeName,
    )[0].id;
    const request = {
      enabled: config.enabled,
      logging: config.logging,
      priority: config.priority,
      firewallMatch: config.firewallMatch,
      dnatExternalPort: config.dnatExternalPort,
      externalAddresses: config.externalAddresses,
      internalAddresses: config.internalAddresses,
      internalPort: config.internalPort,
      name: config.name,
      snatDestinationAddresses: config.snatDestinationAddresses,
      applicationPortProfile: config.applicationPortProfile,
      type: config.type,
      description: config.description,
      id: config.ruleId,
    };
    const options = {
      body: request,
      urlParams: {
        gatewayId,
        natId: config.ruleId,
      },
      headers: { Authorization: `Bearer ${config.authToken}` },
    };
    const endpoint = 'NatEndpointService.updateNatEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const nat = await this.vcloudWrapperService.request(wrapper(options));
    return Promise.resolve({
      __vcloudTask: nat.headers['location'],
    });
  }
}
