import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { NoIpIsAssignedException } from 'src/infrastructure/exceptions/no-ip-is-assigned.exception';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { GetEdgeGatewayDto } from './dto/get-edgegateway.dto';
import { GetDhcpForwarderDto } from './dto/get-dhcp-forwarder.dto';
import { GetDnsForwarderDto } from './dto/get-dns-forwarder.dto';
import { VcloudTask } from 'src/infrastructure/dto/vcloud-task.dto';
import { UpdateDnsForwarderConfig } from './dto/update-dns-forwarder.dto';

@Injectable()
export class EdgeGatewayWrapperService {
  constructor(private readonly vcloudWrapperService: VcloudWrapperService) {}
  async getEdgeGateway(
    authToken: string,
    page = 1,
    pageSize = 25,
  ): Promise<GetEdgeGatewayDto> {
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
    const edgeGateways =
      await this.vcloudWrapperService.request<GetEdgeGatewayDto>(
        wrapper(options),
      );
    return Promise.resolve(edgeGateways.data);
  }
  async getDhcpForwarder(
    authToken: string,
    edgeName: string,
  ): Promise<GetDhcpForwarderDto> {
    const gateway = await this.getEdgeGateway(authToken);
    if (isEmpty(gateway.values[0])) {
      return Promise.reject(new NoIpIsAssignedException());
    }
    const gatewayId = gateway.values.filter(
      (value) => value.name === edgeName,
    )[0].id;
    const endpoint = 'EdgeGatewayEndpointService.getDhcpForwarderEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const dhcpForwarder =
      await this.vcloudWrapperService.request<GetDhcpForwarderDto>(
        wrapper({
          headers: { Authorization: `Bearer ${authToken}` },
          urlParams: { gatewayId },
        }),
      );
    return Promise.resolve(dhcpForwarder.data);
  }
  async getDnsForwarder(
    authToken: string,
    edgeName: string,
  ): Promise<GetDnsForwarderDto> {
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
    const dns = await this.vcloudWrapperService.request<GetDnsForwarderDto>(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { gatewayId },
      }),
    );
    return Promise.resolve(dns.data);
  }
  async updateDhcpForwarder(
    dhcpServers: string[],
    enabled: boolean,
    version: number,
    edgeName: string,
    authToken: string,
  ): Promise<VcloudTask> {
    const gateway = await this.getEdgeGateway(authToken);
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
  async updateDnsForwarder(
    config: UpdateDnsForwarderConfig,
    edgeName: string,
  ): Promise<VcloudTask> {
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
