import { Injectable } from '@nestjs/common';

@Injectable()
export class NetworkEndpointService {
  createNetworkEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/cloudapi/1.0.0/orgVdcNetworks`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  deleteNetworkEndpoint(options?: any) {
    return {
      method: 'delete',
      resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}`,
      params: options.params,
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  getNetworkEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/orgVdcNetworks`,
      params: {
        filter: `id==${options.urlParams.networkId}`,
      },
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  getNetworkIPUsageListEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/allocatedIpAddresses`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  getNetworkListEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/orgVdcNetworks`,
      params: options.params,
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  updateNetworkEndpoint(options?: any) {
    return {
      method: 'put',
      resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
}
