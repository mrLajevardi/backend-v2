import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminUserEndpointService {
  createProviderSessionEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/cloudapi/1.0.0/sessions/provider`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
  createUserEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/api/admin/org/${options.urlParams.orgId}/users`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/*+json;version=36.3',
        'Content-Type': 'application/*+json',
        ...options.headers,
      },
    };
  }
  createUserSessionEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/cloudapi/1.0.0/sessions`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
}
