import { Injectable } from '@nestjs/common';
import { CreateDhcpBindingDto } from './dto/create-dhcp-binding.dto';
import { EndpointInterface } from 'src/wrappers/interfaces/endpoint.interface';
import { DeleteDhcpBindingDto } from './dto/delete-dhcp-bindings.dto';
import { DeleteDhcpDto } from './dto/delete-dhcp.dto';
import { GetAllDhcpBindingsDto } from './dto/get-all-dhcp-binding.dto';
import { GetDhcpBindingsDto } from './dto/get-dhcp-binding.dto';
import { UpdateDhcpBindingDto } from './dto/update-dhcp-bindings.dto';
import { UpdateDhcpDto } from './dto/update-dhcp.dto';
import { GetDhcpDto } from './dto/get-dhcp.dto';
import { getAccept } from '../../../../../../infrastructure/helpers/get-accept.helper';
import { VcloudAcceptEnum } from '../../../../../../infrastructure/enum/vcloud-accept.enum';

@Injectable()
export class DhcpEndpointService {
  name: string;
  constructor() {
    this.name = 'DhcpEndpointService';
  }

  createDhcpBindingEndpoint(options: CreateDhcpBindingDto): EndpointInterface {
    return {
      method: 'post',
      resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/dhcp/bindings`,
      params: {},
      body: options.body,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        ...options.headers,
      },
    };
  }
  deleteDhcpBindingsEndpoint(options: DeleteDhcpBindingDto): EndpointInterface {
    return {
      method: 'delete',
      resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/dhcp/bindings/${options.urlParams.bindingId}`,
      params: {},
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        ...options.headers,
      },
    };
  }
  deleteDhcpEndpoint(options: DeleteDhcpDto): EndpointInterface {
    return {
      method: 'delete',
      resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/dhcp`,
      params: {},
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        ...options.headers,
      },
    };
  }
  getAllDhcpBindingEndpoint(options: GetAllDhcpBindingsDto): EndpointInterface {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/dhcp/bindings`,
      params: options.params,
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        ...options.headers,
      },
    };
  }
  getDhcpBindingEndpoint(options: GetDhcpBindingsDto): EndpointInterface {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/dhcp/bindings/${options.urlParams.bindingId}`,
      params: {},
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        ...options.headers,
      },
    };
  }
  getDhcpEndpoint(options: GetDhcpDto): EndpointInterface {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/dhcp`,
      params: {},
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  updateDhcpBindingEndpoint(options: UpdateDhcpBindingDto): EndpointInterface {
    return {
      method: 'put',
      resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/dhcp/bindings/${options.urlParams.bindingId}`,
      params: {},
      body: options.body,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        ...options.headers,
      },
    };
  }
  updateDhcpEndpoint(options: UpdateDhcpDto): EndpointInterface {
    return {
      method: 'put',
      resource: `/cloudapi/1.0.0/orgVdcNetworks/${options.urlParams.networkId}/dhcp`,
      params: {},
      body: options.body,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        ...options.headers,
      },
    };
  }
}
