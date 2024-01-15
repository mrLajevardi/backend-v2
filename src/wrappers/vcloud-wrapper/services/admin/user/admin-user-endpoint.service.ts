import { Injectable } from '@nestjs/common';
import {
  EndpointInterface,
  EndpointOptionsInterface,
} from 'src/wrappers/interfaces/endpoint.interface';
import { CreateUserDto } from './dto/create-user.dtop';
import { getAccept } from '../../../../../infrastructure/helpers/get-accept.helper';
import { VcloudAcceptEnum } from '../../../../../infrastructure/enum/vcloud-accept.enum';

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
        Accept: getAccept(VcloudAcceptEnum.Json),
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
        Accept: getAccept(VcloudAcceptEnum.AllPlusJson),
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
        Accept: getAccept(VcloudAcceptEnum.Json),
        ...options.headers,
      },
    };
  }
}
