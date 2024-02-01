import { Injectable } from '@nestjs/common';
import { EndpointInterface } from '../../../../interfaces/endpoint.interface';
import { ZAMMAD_API_VERSION } from '../../../const/zammad-version.const';
import { CreateZammadUserInterface } from './interface/create-user.interface';

@Injectable()
export class ZammadUserEndpointService {
  createUser(options: CreateZammadUserInterface): EndpointInterface {
    return {
      method: 'post',
      resource: `api/${ZAMMAD_API_VERSION}/users`,
      params: null,
      body: options.body,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
}
