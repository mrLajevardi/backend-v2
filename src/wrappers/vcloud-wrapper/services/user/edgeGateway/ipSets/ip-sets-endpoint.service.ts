import { Injectable } from '@nestjs/common';

@Injectable()
export class IpSetsEndpointService {
  createIpSetsEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/cloudapi/1.0.0/firewallGroups`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
  deleteIpSetsEndpoint(options?: any) {
    return {
      method: 'delete',
      resource: `/cloudapi/1.0.0/firewallGroups/${options.urlParams.ipSetId}`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
  getIpSetsEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/firewallGroups/${options.urlParams.ipSetId}`,
      params: options.params,
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  getIpSetsListEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/firewallGroups/summaries`,
      params: options.params,
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  updateIpSetsEndpoint(options?: any) {
    return {
      method: 'put',
      resource: `/cloudapi/1.0.0/firewallGroups/${options.urlParams.ipSetId}`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
  
}
