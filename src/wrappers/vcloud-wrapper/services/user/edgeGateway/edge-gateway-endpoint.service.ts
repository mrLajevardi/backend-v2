import { Injectable } from '@nestjs/common';

@Injectable()
export class EdgeGatewayEndpointService {
  getDhcpForwarderEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/dhcpForwarder`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  getDnsForwarderEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/dns`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  getEdgeGatewayEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/edgeGateways`,
      params: options.params,
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  updateDhcpForwarderEndpoint(options?: any) {
    return {
      method: 'put',
      resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/dhcpForwarder`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  updateDnsForwarderEndpoint(options?: any) {
    return {
      method: 'put',
      resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/dns`,
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
