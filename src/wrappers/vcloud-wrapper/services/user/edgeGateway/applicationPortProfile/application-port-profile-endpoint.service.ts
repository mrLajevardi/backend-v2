import { Injectable } from '@nestjs/common';

@Injectable()
export class ApplicationPortProfileEndpointService {
  createApplicationPortProfilesEndpoint(options?: any) {
    return {
      method: 'post',
      resource: `/cloudapi/1.0.0/applicationPortProfiles/`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
  deleteApplicationPortProfilesEndpoint(options?: any) {
    return {
      method: 'delete',
      resource: `/cloudapi/1.0.0/applicationPortProfiles/${options.urlParams.applicationId}`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
  getApplicationPortProfileEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/applicationPortProfiles/${options.urlParams.applicationId}`,
      params: options.params,
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
  getApplicationPortProfilesListEndpoint(options?: any) {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/applicationPortProfiles`,
      params: options.params,
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
  updateApplicationPortProfilesEndpoint(options?: any) {
    return {
      method: 'put',
      resource: `/cloudapi/1.0.0/applicationPortProfiles/${options.urlParams.applicationId}`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/* +json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
}
