import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminVdcEndpointService {
  createVdcEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/api/admin/org/${options.urlParams.orgId}/vdcsparams`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/*+json;version=36.3',
        'Content-Type': 'application/*+json',
        ...options.headers,
      },
    };
  }
  deleteVdcEndpoint(options?: any) {
    return {
      method: 'delete',
      resource: `/api/admin/vdc/${options.urlParams.vdcId[0]}?force=true&recursive=true`,
      params: {},
      headers: {
        Accept: 'application/*+json;version=36.3',
        'Content-Type': 'application/*+json',
        ...options.headers,
      },
    };
  }
  disableVdcEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `api/admin/vdc/${options.urlParams.vdcId}/action/disable`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/*+json;version=36.3',
        'Content-Type': 'application/*+json',
        ...options.headers,
      },
    };
  }
  enableVdcEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/api/admin/vdc/${options.urlParams.vdcId}/action/enable`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/*+json;version=36.3',
        'Content-Type': 'application/*+json',
        ...options.headers,
      },
    };
  }
  updateNetworkProfileEndpoint(options?: any) {
    return {
      method: 'put',
      resource: `/cloudapi/1.0.0/vdcs/${options.urlParams.vdcId}/networkProfile`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  updateVdcEndpoint(options?: any) {
    return {
      method: 'put',
      resource: `/api/admin/vdc/${options.urlParams.vdcId}`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/*+json;version=36.3',
        'Content-Type': 'application/*+json',
        ...options.headers,
      },
    };
  }
  updateVdcStorageProfileEndpoint(options?: any) {
    return {
      method: 'put',
      resource: options.fullUrl,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/*+json;version=36.3',
        'Content-Type': 'application/*+json',
        ...options.headers,
      },
    };
  }
}
