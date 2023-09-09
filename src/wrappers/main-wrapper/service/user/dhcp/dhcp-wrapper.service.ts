import { Injectable } from '@nestjs/common';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { EdgeGatewayWrapperService } from '../edgeGateway/edge-gateway-wrapper.service';
import { isEmpty } from 'lodash';
import { NoIpIsAssignedException } from 'src/infrastructure/exceptions/no-ip-is-assigned.exception';
import { CreateDhcpBindingBody } from 'src/wrappers/vcloud-wrapper/services/user/edgeGateway/dhcp/dto/create-dhcp-binding.dto';
import { VcloudTask } from 'src/infrastructure/dto/vcloud-task.dto';
import { GetAllDhcpBindingDto } from './dto/get-all-dhcp-bindings.dto';
import { AxiosResponse } from 'axios';
import { GetDhcpDto } from 'src/application/networks/dto/get-dhcp.dto';
import { GetDhcpBindingDto } from './dto/get-dhcp-binding.dto';
import { DhcpPool } from 'src/wrappers/vcloud-wrapper/services/user/edgeGateway/dhcp/dto/update-dhcp.dto';
import { UpdateDhcpBindingBody } from 'src/wrappers/vcloud-wrapper/services/user/edgeGateway/dhcp/dto/update-dhcp-bindings.dto';

@Injectable()
export class DhcpWrapperService {
  constructor(
    private readonly vcloudWrapperService: VcloudWrapperService,
    private readonly edgeGatewayWrapperService: EdgeGatewayWrapperService,
  ) {}
  async createDhcpBinding(
    authToken: string,
    networkId: string,
    config: Omit<CreateDhcpBindingBody, 'bindingType'>,
  ): Promise<VcloudTask> {
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
  async deleteDhcp(authToken: string, networkId: string): Promise<VcloudTask> {
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

  async deleteDhcpBinding(
    authToken: string,
    networkId: string,
    bindingId: string,
  ): Promise<VcloudTask> {
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
  async getAllDhcpBindings(
    authToken: string,
    networkId: string,
    pageSize: number,
    cursor = '',
  ): Promise<AxiosResponse<GetAllDhcpBindingDto, any>> {
    const endpoint = 'DhcpEndpointService.getAllDhcpBindingEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const dhcp = await this.vcloudWrapperService.request<GetAllDhcpBindingDto>(
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
  async getDhcp(authToken: string, networkId: string): Promise<GetDhcpDto> {
    const endpoint = 'DhcpEndpointService.getDhcpEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const dhcp = await this.vcloudWrapperService.request<GetDhcpDto>(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: {
          networkId,
        },
      }),
    );
    return Promise.resolve(dhcp.data);
  }
  async getDhcpBinding(
    authToken: string,
    networkId: string,
    bindingId: string,
  ): Promise<GetDhcpBindingDto> {
    const endpoint = 'DhcpEndpointService.getDhcpBindingEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const dhcp = await this.vcloudWrapperService.request<GetDhcpBindingDto>(
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
  async updateDhcp(
    authToken: string,
    dhcpPools: DhcpPool[],
    ipAddress: string, // ipAddress of gateway cidr
    dnsServers: string[], // limit 2
    leaseTime: number,
    networkId: string,
    mode: string, // EDGE, NETWORK and RELAY
  ): Promise<VcloudTask> {
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
  async updateDhcpBinding(
    authToken: string,
    networkId: string,
    config: Omit<UpdateDhcpBindingBody, 'bindingType'>,
    bindingId: string,
  ): Promise<VcloudTask> {
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
