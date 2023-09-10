import { Injectable } from '@nestjs/common';
import { CreateNatDto } from './dto/create-nat.dto';
import { EndpointInterface } from 'src/wrappers/interfaces/endpoint.interface';
import { DeleteNatDto } from './dto/delete-nat.dto';
import { UpdateNatDto } from './dto/update-nat.dto';
import { GetNatDto } from './dto/get-nat.dto';
import { GetNatListDto } from './dto/get-nat-list.dto';

@Injectable()
export class NatEndpointService {
  name: string;
  constructor() {
    this.name = 'NatEndpointService';
  }
  createNatEndpoint(options: CreateNatDto): EndpointInterface {
    return {
      method: 'post',
      resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/nat/rules`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  deleteNatEndpoint(options: DeleteNatDto): EndpointInterface {
    return {
      method: 'delete',
      resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/nat/rules/${options.urlParams.natId}`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  getNatEndpoint(options: GetNatDto): EndpointInterface {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/nat/rules/${options.urlParams.natId}`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  getNatListEndpoint(options: GetNatListDto): EndpointInterface {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/nat/rules`,
      params: options.params,
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  updateNatEndpoint(options: UpdateNatDto): EndpointInterface {
    return {
      method: 'put',
      resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/nat/rules/${options.urlParams.natId}`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
}
