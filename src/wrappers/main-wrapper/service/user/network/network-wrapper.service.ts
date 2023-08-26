import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { NoIpIsAssignedException } from 'src/infrastructure/exceptions/no-ip-is-assigned.exception';
import { VcloudWrapperService } from 'src/wrappers/vcloud-wrapper/services/vcloud-wrapper.service';
import { EdgeGatewayWrapperService } from '../edgeGateway/edge-gateway-wrapper.service';

@Injectable()
export class NetworkWrapperService {
  constructor(
    private readonly vcloudWrapperService: VcloudWrapperService,
    private readonly edgeGatewayWrapperService: EdgeGatewayWrapperService,
  ) {}
  /**
   * @param {Object} config
   * @param {String} edgeName
   * @param {String} config.name
   * @param {String} config.gateway
   * @param {String} config.dnsServer1
   * @param {String} config.dnsServer2
   * @param {String} config.dnsSuffix
   * @param {String} config.vdcId
   * @param {String} config.connectionTypeValue
   * @param {String} config.connectionType
   * @param {Object} config.ipRanges
   * @param {Array}  config.ipRanges.values
   * @param {Number} config.prefixLength
   * @param {String} config.authToken
   * @param {String} config.networkType
   * @return {Promise}
   */
  async createNetwork(config, edgeName = null) {
    let gateway: any = await this.edgeGatewayWrapperService.getEdgeGateway(
      config.authToken,
    );
    if (isEmpty(gateway.values[0])) {
      return Promise.reject(new NoIpIsAssignedException());
    }
    gateway = gateway.values.filter((value) => value.name === edgeName);
    const gatewayId = gateway[0].id;
    let connection = null;
    if (config.networkType !== 'ISOLATED') {
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
              values: config.ipRanges.values,
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
  /**
   *
   * @param {String} authToken
   * @param {String} networkId
   * @return {Promise}
   */
  async deleteNetwork(authToken, networkId) {
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
  /**
   * get a list of networks
   * to get a single network use filter eg: id==<networkId>
   * @param {String} authToken
   * @param {Number} page
   * @param {Number} pageSize
   * @param {Number} filter
   * @return {Promise}
   */
  async getIPUsageNetwrok(authToken, page = 1, pageSize = 25, networkId) {
    const params = {
      page,
      pageSize,
    };
    const endpoint = 'NetworkEndpointService.getNetworkIPUsageListEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const networks = await this.vcloudWrapperService.request(
      wrapper({
        headers: { Authorization: `Bearer ${authToken}` },
        urlParams: { networkId },
        params,
      }),
    );
    return Promise.resolve(networks.data);
  }
  /**
   * get a list of networks
   * to get a single network use filter eg: id==<networkId>
   * @param {String} authToken
   * @param {Number} page
   * @param {Number} pageSize
   * @param {Number} filter
   * @return {Promise}
   */
  async getNetwork(authToken, page = 1, pageSize = 25, filter = '') {
    const params = {
      page,
      pageSize,
      filter,
      filterEncoded: true,
    };
    const endpoint = 'NetworkEndpointService.getNetworkListEndpoint';
    const wrapper =
      this.vcloudWrapperService.getWrapper<typeof endpoint>(endpoint);
    const networks = await this.vcloudWrapperService.request(
      wrapper({
        params,
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    );
    return Promise.resolve(networks.data);
  }
  /**
   * update network
   * @param {Object} config
   * @param {String} networkId
   * @param {String} edgeName
   * @param {String} config.name
   * @param {String} config.gateway
   * @param {String} config.dnsServer1
   * @param {String} config.dnsServer2
   * @param {String} config.dnsSuffix
   * @param {String} config.vdcId
   * @param {String} config.connectionTypeValue
   * @param {String} config.connectionType
   * @param {Object} config.ipRanges
   * @param {Array}  config.ipRanges.values
   * @param {Number} config.prefixLength
   * @param {String} config.authToken
   * @param {String} config.networkType
   */
  async updateNetwork(config, networkId, edgeName) {
    const gateway: any = await this.edgeGatewayWrapperService.getEdgeGateway(
      config.authToken,
    );
    const gatewayId = gateway.values.filter(
      (value) => value.name === edgeName,
    )[0].id;
    let connection = null;
    if (config.networkType !== 'ISOLATED') {
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
              values: config.ipRanges.values,
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
