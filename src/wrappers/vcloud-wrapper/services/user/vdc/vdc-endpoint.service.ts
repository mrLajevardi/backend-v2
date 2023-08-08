import { Injectable } from '@nestjs/common';

@Injectable()
export class VdcEndpointService {
  attachNamedDisk(options?: any) {
    return {
      method: 'post',
      resource: `/api/vApp/${options.urlParams.vmID}/disk/action/attach`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  createNamedDisk(options?: any) {
    return {
      method: 'post',
      resource: `/api/vdc/${options.urlParams.vdcId}/disk`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +xml;',
        ...options.headers,
      },
    };
  }
  detachNamedDisk(options?: any) {
    return {
      method: 'post',
      resource: `/api/vApp/${options.urlParams.vmID}/disk/action/detach`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  getHardwareInfoEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/api/vdc/${options.urlParams.vdcId}/hwv/vmx-19`,
      params: options.params,
      body: null,
      headers: {
        'Content-Type': 'application/* +json;',
        Accept: 'application/* +json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
  getVdcComputePolicyEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/cloudapi/2.0.0/vdcs/${options.urlParams.vdcId}/computePolicies`,
      params: options.params,
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  vmAttachedNamedDisk(options?: any) {
    return {
      method: 'get',
      resource: `/api/disk/${options.urlParams.nameDiskID}/attachedVms`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  removeNamedDisk(options?: any) {
    return {
      method: 'delete',
      resource: `/api/disk/${options.urlParams.nameDiskID}`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +xml;',
        ...options.headers,
      },
    };
  }
  updateNamedDisk(options?: any) {
    return {
      method: 'put',
      resource: `/api/disk/${options.urlParams.nameDiskID}`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +xml;',
        ...options.headers,
      },
    };
  }
  vcloudQueryEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/api/query`,
      params: options.params,
      body: null,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
}
