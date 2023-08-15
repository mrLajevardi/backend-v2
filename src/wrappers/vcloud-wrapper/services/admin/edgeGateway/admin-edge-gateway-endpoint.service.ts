import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminEdgeGatewayEndpointService {
  createEdgeGatewayEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/cloudapi/1.0.0/edgeGateways`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  getAvailableIpAddressesEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/externalNetworks/${options.urlParams.externalNetworkId}/availableIpAddresses`,
      params: options.params,
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  getExternalNetworksEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/externalNetworks`,
      params: options.params,
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  getNsxtEdgeClustersEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/nsxTResources/edgeClusters`,
      params: options.params,
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
}
