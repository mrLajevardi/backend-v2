import { Injectable } from '@nestjs/common';
import { getIPRange } from 'get-ip-range';
import { isNil } from 'lodash';
import { CreateEdgeGatewayBody } from 'src/wrappers/vcloud-wrapper/services/admin/edgeGateway/dto/create-edge-gateway.dto';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { GetExternalNetworksDto } from './dto/get-external-networks.dto';
import {
  GetAvailableIPAddressesDto,
  Value,
} from './dto/get-available-ip-addresses.dto';
import { CreateEdgeConfig, CreateEdgeDto } from './dto/create-edge.dto';
import { GetEdgeClusterDto } from './dto/get-edge-cluster.dto';
import {
  UpdateEdgeGatewayCoReturnType,
  UpdateEdgeGatewayConfigDto,
} from './dto/update-edge.dto';

@Injectable()
export class AdminEdgeGatewayWrapperService {
  constructor(private readonly vcloudWrapperService: VcloudWrapperService) {}
  async getExternalNetworks(
    authToken: string,
    page = 1,
    pageSize = 25,
  ): Promise<GetExternalNetworksDto> {
    const options = {
      params: {
        page,
        pageSize,
        sortAsc: 'name',
        filter:
          '((networkBackings.values.backingTypeValue==NSXT_TIER0,networkBackings.values.backingTypeValue==NSXT_VRF_TIER0));usingIpSpace==false',
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    const endpoint =
      'AdminEdgeGatewayEndpointService.getExternalNetworksEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const externalNetworks =
      await this.vcloudWrapperService.request<GetExternalNetworksDto>(
        wrapper(options),
      );
    return Promise.resolve(externalNetworks.data);
  }
  async getAvailableIpAddresses(
    externalNetworkId: string,
    authToken: string,
  ): Promise<Value[]> {
    const options = {
      urlParams: {
        externalNetworkId,
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    const endpoint =
      'AdminEdgeGatewayEndpointService.getAvailableIpAddressesEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const availableIpAddressesList =
      await this.vcloudWrapperService.request<GetAvailableIPAddressesDto>(
        wrapper(options),
      );
    return Promise.resolve(
      availableIpAddressesList.data.values[0]?.ipRanges?.values,
    );
  }

  /**
   * get external networks
   * @param {String} authToken
   * @param {Number} page
   * @param {Number} pageSize
   * @return {Promise}
   */
  public async findExternalNetwork(
    authToken: string,
    page = 1,
    pageSize = 25,
  ): Promise<GetExternalNetworksDto> {
    const network = await this.getExternalNetworks(authToken, page, pageSize);
    return Promise.resolve(network);
  }
  public async ipAllocation(
    externalNetworkId: string,
    authToken: string,
    userIpCount: number,
  ): Promise<Value[]> {
    const availableIp = await this.getAvailableIpAddresses(
      externalNetworkId,
      authToken,
    );
    let index = 0;
    if (isNil(availableIp)) {
      return Promise.reject(new Error('there is no ip remaining'));
    }
    const allocatedIPAddresses = [];
    let ipRange = availableIp[index];
    let ipAddresses = getIPRange(ipRange.startAddress, ipRange.endAddress);
    for (let remainingIp = userIpCount; remainingIp > 0; ) {
      if (ipAddresses.length > 0) {
        allocatedIPAddresses.push({
          startAddress: ipAddresses[0],
          endAddress: ipAddresses[0],
        });
        ipAddresses.shift();
        remainingIp--;
      } else if (availableIp.length >= index + 2) {
        index++;
        ipRange = availableIp[index];
        ipAddresses = getIPRange(ipRange.startAddress, ipRange.endAddress);
      } else {
        break;
      }
    }
    if (allocatedIPAddresses.length < userIpCount) {
      return Promise.reject(new Error('there is no ip remaining'));
    }
    return Promise.resolve(allocatedIPAddresses);
  }
  async createEdge(config: CreateEdgeConfig): Promise<CreateEdgeDto> {
    const network = await this.findExternalNetwork(config.authToken);
    const networkValue = network.values[0];
    const ipRange = await this.ipAllocation(
      networkValue.id,
      config.authToken,
      config.userIpCount,
    );
    const request: CreateEdgeGatewayBody = {
      name: config.name,
      description: '',
      ownerRef: {
        id: config.vdcId,
      },
      edgeGatewayUplinks: [
        {
          uplinkId: networkValue.id,
          uplinkName: networkValue.name,
          subnets: {
            values: [
              {
                gateway: networkValue.subnets.values[0].gateway,
                prefixLength: networkValue.subnets.values[0].prefixLength,
                dnsSuffix: null,
                dnsServer1: '',
                dnsServer2: '',
                ipRanges: {
                  values: ipRange,
                },
                enabled: true,
                totalIpCount: networkValue.subnets.values[0].totalIpCount,
                usedIpCount: networkValue.subnets.values[0].usedIpCount,
              },
            ],
          },
          dedicated: false,
        },
      ],
    };
    const options = {
      headers: {
        Authorization: `Bearer ${config.authToken}`,
      },
      body: request,
    };
    const endpoint =
      'AdminEdgeGatewayEndpointService.createEdgeGatewayEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const edgeGateway: any = await this.vcloudWrapperService.request(
      wrapper(options),
    );
    return Promise.resolve({
      name: config.name,
      ipRange: ipRange,
      __vcloudTask: edgeGateway.headers['location'],
    });
  }
  async getEdgeCluster(vdcId: string, authToken: string): Promise<string> {
    const options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      params: {
        page: 1,
        pageSize: 25,
        filter: `orgVdcId==${vdcId}`,
      },
    };
    const endpoint =
      'AdminEdgeGatewayEndpointService.getNsxtEdgeClustersEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const edgeClusters =
      await this.vcloudWrapperService.request<GetEdgeClusterDto>(
        wrapper(options),
      );
    return Promise.resolve(edgeClusters.data.values[0]?.id);
  }

  async updateEdge(
    config: UpdateEdgeGatewayConfigDto,
    edgeId: string,
    currentPrimaryIp: string,
  ): Promise<UpdateEdgeGatewayCoReturnType> {
    const network = await this.findExternalNetwork(config.authToken);
    const networkValue = network.values[0];
    let ipRange = await this.ipAllocation(
      networkValue.id,
      config.authToken,
      config.userIpCount,
    );
    const newIpRange = ipRange;
    ipRange = ipRange.concat(config.alreadyAssignedIpList);
    const request = {
      name: config.name,
      description: '',
      ownerRef: {
        id: config.vdcId,
      },
      edgeGatewayUplinks: [
        {
          uplinkId: networkValue.id,
          uplinkName: networkValue.name,
          connected: config.connected ?? true,
          subnets: {
            values: [
              {
                gateway: networkValue.subnets.values[0].gateway,
                prefixLength: networkValue.subnets.values[0].prefixLength,
                dnsSuffix: null,
                dnsServer1: '',
                dnsServer2: '',
                ipRanges: {
                  values: ipRange,
                },
                primaryIp: currentPrimaryIp,
                enabled: true,
                totalIpCount:
                  config.userIpCount + config.alreadyAssignedIpCounts,
                usedIpCount: null,
              },
            ],
          },
          dedicated: false,
        },
      ],
    };
    const options = {
      headers: {
        Authorization: `Bearer ${config.authToken}`,
      },
      body: request,
      urlParams: {
        edgeId,
      },
    };
    const endpoint =
      'AdminEdgeGatewayEndpointService.updateEdgeGatewayEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const edgeGateway =
      await this.vcloudWrapperService.request<GetEdgeClusterDto>(
        wrapper(options),
      );
    return {
      name: config.name,
      ipRange: newIpRange,
      __vcloudTask: edgeGateway.headers.location,
    };
  }
}
