import { Injectable } from '@nestjs/common';
import {
  EndpointInterface,
  EndpointOptionsInterface,
} from 'src/wrappers/interfaces/endpoint.interface';
import { CreateUserDto } from './dto/create-user.dtop';

@Injectable()
export class AdminUserEndpointService {
  name: string;
  constructor() {
    this.name = 'AdminUserEndpointService';
  }
  createProviderSessionEndpoint(
    options: EndpointOptionsInterface,
  ): EndpointInterface {
    return {
      method: 'post',
      resource: `/cloudapi/1.0.0/sessions/provider`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/json;version=38.1',
        ...options.headers,
      },
    };
  }
  createUserEndpoint(options: CreateUserDto): EndpointInterface {
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
  createUserSessionEndpoint(
    options: EndpointOptionsInterface,
  ): EndpointInterface {
    return {
      method: 'post',
      resource: `/cloudapi/1.0.0/sessions`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/json;version=38.1',
        ...options.headers,
      },
    };
  }
}
