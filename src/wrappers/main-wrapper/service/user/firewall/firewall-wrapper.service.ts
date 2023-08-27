import { Injectable } from '@nestjs/common';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { EdgeGatewayWrapperService } from '../edgeGateway/edge-gateway-wrapper.service';
import { isEmpty } from 'lodash';
import { NoIpIsAssignedException } from 'src/infrastructure/exceptions/no-ip-is-assigned.exception';
import { VcloudTask } from 'src/infrastructure/dto/vcloud-task.dto';
import { GetFirewallListDto } from './dto/get-firewall-list.dto';
import { UpdateFirewallBody } from 'src/wrappers/vcloud-wrapper/services/user/edgeGateway/firewall/dto/update-firewall.dto';
import { GetFirewallDto } from './dto/get-firewall.dto';

@Injectable()
export class FirewallWrapperService {
  constructor(
    private readonly vcloudWrapperService: VcloudWrapperService,
    private readonly edgeGatewayWrapperService: EdgeGatewayWrapperService,
  ) {}
  async deleteFirewall(
    authToken: string,
    ruleId: string,
    edgeName: string,
  ): Promise<VcloudTask> {
    const gateway = await this.edgeGatewayWrapperService.getEdgeGateway(
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
      __vcloudTask: firewall.headers.location,
    });
  }
  async getFirewallList(
    authToken: string,
    edgeName: string,
  ): Promise<GetFirewallListDto> {
    const gateway = await this.edgeGatewayWrapperService.getEdgeGateway(
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
    const firewall =
      await this.vcloudWrapperService.request<GetFirewallListDto>(
        wrapper({
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          urlParams: { gatewayId },
        }),
      );
    return Promise.resolve(firewall.data);
  }
  async getSingleFirewall(
    authToken: string,
    ruleId: string,
    edgeName: string,
  ): Promise<GetFirewallDto> {
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
    const firewall: any =
      await this.vcloudWrapperService.request<GetFirewallDto>(
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
  async updateFirewallList(
    authToken: string,
    config: UpdateFirewallBody[],
    edgeName: string,
  ): Promise<VcloudTask> {
    const gateway = await this.edgeGatewayWrapperService.getEdgeGateway(
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
  async updateSingleFirewall(
    authToken: string,
    ruleId: string,
    config: UpdateFirewallBody,
    edgeName: string,
  ): Promise<VcloudTask> {
    const gateway = await this.edgeGatewayWrapperService.getEdgeGateway(
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
