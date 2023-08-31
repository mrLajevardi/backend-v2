import { Injectable } from '@nestjs/common';
import { CreateNetworkDto } from './dto/create-network.dto';
import { EndpointInterface } from 'src/wrappers/interfaces/endpoint.interface';
import { DeleteNetworkDto } from './dto/delete-network.dto';
import { GetNetworkDto } from './dto/get-network.dto';
import { GetNetworkIpUsageListDto } from './dto/get-network-ip-usage-list.dto';
import { GetNetworkListDto } from './dto/get-network-list.dto';
import { UpdateNetworkDto } from './dto/update-network.dto';

@Injectable()
export class NetworkEndpointService {
  name: string;
  constructor() {
    this.name = 'NetworkEndpointService';
  }
  createNetworkEndpoint(options: CreateNetworkDto): EndpointInterface {
    return {
      method: 'post',
      resource: `/cloudapi/1.0.0/orgVdcNetworks`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  deleteNetworkEndpoint(options: DeleteNetworkDto): EndpointInterface {
    return {
      method: 'delete',
      resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  getNetworkEndpoint(options: GetNetworkDto): EndpointInterface {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/orgVdcNetworks`,
      params: {
        filter: `id==${options.urlParams.networkId}`,
      },
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  getNetworkIPUsageListEndpoint(
    options: GetNetworkIpUsageListDto,
  ): EndpointInterface {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/allocatedIpAddresses`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  getNetworkListEndpoint(options: GetNetworkListDto): EndpointInterface {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/orgVdcNetworks`,
      params: options.params,
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  updateNetworkEndpoint(options: UpdateNetworkDto): EndpointInterface {
    return {
      method: 'put',
      resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}`,
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
