import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { NoIpIsAssignedException } from 'src/infrastructure/exceptions/no-ip-is-assigned.exception';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { EdgeGatewayWrapperService } from '../edgeGateway/edge-gateway-wrapper.service';
import { VcloudTask } from 'src/infrastructure/dto/vcloud-task.dto';
import { CreateNetworkDto } from './dto/create-network.dto';
import { GetNetworkListDto } from './dto/get-network-list.dto';
import { GetIpUsageNetworkDto } from './dto/get-ip-usage-network.dto';
import { NetworksTypesEnum } from './enum/network-types.enum';

@Injectable()
export class NetworkWrapperService {
  constructor(
    private readonly vcloudWrapperService: VcloudWrapperService,
    private readonly edgeGatewayWrapperService: EdgeGatewayWrapperService,
  ) {}
  async createNetwork(
    config: CreateNetworkDto,
    edgeName: string | null = null,
  ): Promise<VcloudTask> {
    const gateway = await this.edgeGatewayWrapperService.getEdgeGateway(
      config.authToken,
    );
    if (isEmpty(gateway.values[0])) {
      return Promise.reject(new NoIpIsAssignedException());
    }
    const targetGateway = gateway.values.filter(
      (value) => value.name === edgeName,
    );
    const gatewayId = targetGateway[0].id;
    let connection = null;
    if (config.networkType !== NetworksTypesEnum.Isolated) {
      connection = {
        connectionType: config.connectionType,
        connectionTypeValue: config.connectionTypeValue,
        routerRef: {
          id: gatewayId,
        },
      };
    }
    const request = {
      description: config.description,
      name: config.name,
      networkType: config.networkType,
      subnets: {
        values: [
          {
            dnsServer1: config.dnsServer1,
            dnsServer2: config.dnsServer2,
            dnsSuffix: config.dnsSuffix,
            enabled: true,
            gateway: config.gateway,
            ipRanges: {
              values: [],
            },
            prefixLength: config.prefixLength,
          },
        ],
      },
      ownerRef: {
        id: config.vdcId,
      },
      connection,
    };
    const options = {
      headers: { Authorization: `Bearer ${config.authToken}` },
      body: request,
    };
    const endpoint = 'NetworkEndpointService.createNetworkEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const createdNetwork = await this.vcloudWrapperService.request(
      wrapper(options),
    );
    return Promise.resolve({
      __vcloudTask: createdNetwork.headers['location'],
    });
  }
  async deleteNetwork(
    authToken: string,
    networkId: string,
  ): Promise<VcloudTask> {
    const options = {
      params: {
        force: true,
      },
      urlParams: { networkId },
      headers: { Authorization: `Bearer ${authToken}` },
    };
    const endpoint = 'NetworkEndpointService.deleteNetworkEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const deletedNetwork = await this.vcloudWrapperService.request(
      wrapper(options),
    );
    return Promise.resolve({
      __vcloudTask: deletedNetwork.headers['location'],
    });
  }
  async getIPUsageNetwork(
    authToken: string,
    page = 1,
    pageSize = 25,
    networkId: string,
  ): Promise<GetIpUsageNetworkDto> {
    const params = {
      page,
      pageSize,
    };
    const endpoint = 'NetworkEndpointService.getNetworkIPUsageListEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const networks =
      await this.vcloudWrapperService.request<GetIpUsageNetworkDto>(
        wrapper({
          headers: { Authorization: `Bearer ${authToken}` },
          urlParams: { networkId },
          params,
        }),
      );
    return Promise.resolve(networks.data);
  }
  async getNetwork(
    authToken: string,
    page = 1,
    pageSize = 25,
    filter = '',
    additionalHeaders?: object,
  ): Promise<GetNetworkListDto> {
    const params = {
      page,
      pageSize,
      filter,
      filterEncoded: true,
    };
    const endpoint = 'NetworkEndpointService.getNetworkListEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const networks = await this.vcloudWrapperService.request<GetNetworkListDto>(
      wrapper({
        params,
        headers: { Authorization: `Bearer ${authToken}`, ...additionalHeaders },
      }),
    );
    return Promise.resolve(networks.data);
  }
  async updateNetwork(
    config: CreateNetworkDto,
    networkId: string,
    edgeName: string,
  ): Promise<VcloudTask> {
    const gateway: any = await this.edgeGatewayWrapperService.getEdgeGateway(
      config.authToken,
    );
    const gatewayId = gateway.values.filter(
      (value) => value.name === edgeName,
    )[0].id;
    let connection = null;
    if (config.networkType !== NetworksTypesEnum.Isolated) {
      connection = {
        connectionType: config.connectionType,
        connectionTypeValue: config.connectionTypeValue,
        routerRef: {
          id: gatewayId,
        },
      };
    }
    const request = {
      description: config.description,
      name: config.name,
      networkType: config.networkType,
      subnets: {
        values: [
          {
            dnsServer1: config.dnsServer1,
            dnsServer2: config.dnsServer2,
            dnsSuffix: config.dnsSuffix,
            enabled: config.enabled || true,
            gateway: config.gateway,
            ipRanges: {
              values: [],
            },
            prefixLength: config.prefixLength,
          },
        ],
      },
      ownerRef: {
        id: config.vdcId,
      },
      connection,
    };
    const options = {
      body: request,
      urlParams: { networkId },
      headers: { Authorization: `Bearer ${config.authToken}` },
    };
    const endpoint = 'NetworkEndpointService.updateNetworkEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const updatedNetwork = await this.vcloudWrapperService.request(
      wrapper(options),
    );
    return Promise.resolve({
      __vcloudTask: updatedNetwork.headers['location'],
    });
  }
}
