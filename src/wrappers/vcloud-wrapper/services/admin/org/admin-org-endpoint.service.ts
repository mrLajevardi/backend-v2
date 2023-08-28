import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminOrgEndpointService {
  createOrgCatalogEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/api/admin/org/${options.urlParams.orgId}/catalogs`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/*+json;version=36.3',
        'Content-Type': 'application/*+json',
        ...options.headers,
      },
    };
  }
  createOrgEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/cloudapi/1.0.0/orgs`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
  deleteOrgCatalogEndpoint(options?: any) {
    return {
      method: 'delete',
      resource: `/api/admin/catalog/${options.urlParams.catalogId}?recursive=true&force=true`,
      body: null,
      params: {},
      headers: {
        Accept: 'application/*+json;version=36.3',
        'Content-Type': 'application/*+json',
        ...options.headers,
      },
    };
  }
  getOrgEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/orgs`,
      params: options.params,
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
}
