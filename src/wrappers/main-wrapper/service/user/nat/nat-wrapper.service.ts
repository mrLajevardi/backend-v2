import { Injectable } from '@nestjs/common';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { EdgeGatewayWrapperService } from '../edgeGateway/edge-gateway-wrapper.service';
import { isEmpty } from 'lodash';
import { NoIpIsAssignedException } from 'src/infrastructure/exceptions/no-ip-is-assigned.exception';
import { CreateNatRuleConfig } from './dto/create-nat-rule.dto';
import { VcloudTask } from 'src/infrastructure/dto/vcloud-task.dto';
import { GetNatRuleListDto } from './dto/get-nat-rule-list.dto';
import { AxiosResponse } from 'axios';
import { GetNatRuleDto } from './dto/get-nat-rule.dto';
import { UpdateNatRuleConfig } from './dto/update-nat-rule.dto';

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
  async createNatRule(
    config: CreateNatRuleConfig,
    edgeName: string,
  ): Promise<VcloudTask> {
    const gateway = await this.edgeGatewayWrapperService.getEdgeGateway(
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
  async deleteNatRule(
    authToken: string,
    ruleId: string,
    edgeName: string,
  ): Promise<VcloudTask> {
    const gateway = await this.edgeGatewayWrapperService.getEdgeGateway(
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
  async getNatRule(
    authToken: string,
    ruleId: string,
    edgeName: string,
  ): Promise<GetNatRuleDto> {
    const gateway = await this.edgeGatewayWrapperService.getEdgeGateway(
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
    const natRule = await this.vcloudWrapperService.request<GetNatRuleDto>(
      wrapper(options),
    );
    return Promise.resolve(natRule.data);
  }
  async getNatRuleList(
    authToken: string,
    pageSize = 1,
    cursor = '',
    edgeName: string,
  ): Promise<AxiosResponse<GetNatRuleListDto>> {
    const gateway = await this.edgeGatewayWrapperService.getEdgeGateway(
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
    const natRules = await this.vcloudWrapperService.request<GetNatRuleListDto>(
      wrapper({
        params,
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { gatewayId },
      }),
    );
    return Promise.resolve(natRules);
  }

  async updateNatRule(
    config: UpdateNatRuleConfig,
    edgeName: string,
  ): Promise<VcloudTask> {
    const gateway = await this.edgeGatewayWrapperService.getEdgeGateway(
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
