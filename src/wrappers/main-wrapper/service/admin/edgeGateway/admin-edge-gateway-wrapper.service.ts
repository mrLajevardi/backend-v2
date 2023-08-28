import { Injectable } from '@nestjs/common';
import { getIPRange } from 'get-ip-range';
import { isNil } from 'lodash';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';

@Injectable()
export class AdminEdgeGatewayWrapperService {
  constructor(private readonly vcloudWrapperService: VcloudWrapperService) {}
  /**
   * get external networks from vcloud this method is used to find uplink id
   * @param {String} authToken
   * @param {Number} page
   * @param {Number} pageSize
   * @return {Promise} return data of external networks
   */
  async getExternalNetworks(authToken, page = 1, pageSize = 25) {
    const options = {
      params: {
        page,
        pageSize,
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    const endpoint =
      'AdminEdgeGatewayEndpointService.getExternalNetworksEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const externalNetworks: any = await this.vcloudWrapperService.request(
      wrapper(options),
    );
    return Promise.resolve(externalNetworks.data);
  }
  /**
   * get available ip addresses from vcloud
   * @param {String} externalNetworkId
   * @param {String} authToken
   */
  async getAvailableIpAddresses(externalNetworkId, authToken) {
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
    const availableIpAddressesList: any =
      await this.vcloudWrapperService.request(wrapper(options));
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
  private async findExternalNetwork(authToken, page = 1, pageSize = 25) {
    const network = await this.getExternalNetworks(authToken, page, pageSize);
    return Promise.resolve(network);
  }
  /**
   * check if theres is enough remaining ip and allocate ip to user
   * @param {String} externalNetworkId uplink id
   * @param {String} authToken
   * @param {Number} userIpCount
   * @return {Promise<Array>} list of allocated ips to user
   */
  private async ipAllocation(externalNetworkId, authToken, userIpCount) {
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
      } else {
        index++;
        ipRange = availableIp[index];
        ipAddresses = getIPRange(ipRange.startAddress, ipRange.endAddress);
      }
    }
    if (allocatedIPAddresses.length < userIpCount) {
      return Promise.reject(new Error('there is no ip remaining'));
    }
    return Promise.resolve(allocatedIPAddresses);
  }
  /**
   * create edge gateway for user
   * @param {Object} config
   * @param {String} config.name required
   * @param {String} config.vdcId required
   * @param {String} config.authToken required
   * @param {String} config.userIpCount number of user ip addresses
   * @return {Promise}
   */
  async createEdge(config) {
    const network = await this.findExternalNetwork(config.authToken);
    const networkValue = network.values[0];
    const ipRange = await this.ipAllocation(
      networkValue.id,
      config.authToken,
      config.userIpCount,
    );
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
  /**
   * get available ip addresses from vcloud
   * @param {String} externalNetworkId
   * @param {String} authToken
   */
  async getEdgeCluster(vdcId, authToken) {
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
    const edgeClusters: any = await this.vcloudWrapperService.request(
      wrapper(options),
    );
    return Promise.resolve(edgeClusters.data.values[0]?.id);
  }
}
