import { Injectable } from '@nestjs/common';

@Injectable()
export class DhcpEndpointService {
  createDhcpBindingEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/dhcp/bindings`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
  deleteDhcpBindingsEndpoint(options?: any) {
    return {
      method: 'delete',
      // eslint-disable-next-line max-len
      resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/dhcp/bindings/${options.urlParams.bindingId}`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
  deleteDhcpEndpoint(options?: any) {
    return {
      method: 'delete',
      resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/dhcp`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
  getAllDhcpBindingEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/dhcp/bindings`,
      params: options.params,
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
  getDhcpBindingEndpoint(options?: any) {
    return {
      method: 'get',
      // eslint-disable-next-line max-len
      resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/dhcp/bindings/${options.urlParams.bindingId}`,
      params: options.params,
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
  getDhcpEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/dhcp`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  updateDhcpBindingEndpoint(options?: any) {
    return {
      method: 'put',
      // eslint-disable-next-line max-len
      resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/dhcp/bindings/${options.urlParams.bindingId}`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
  updateDhcpEndpoint(options?: any) {
    return {
      method: 'put',
      resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/dhcp`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
}
