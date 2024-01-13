import { Injectable } from '@nestjs/common';
import { EndpointInterface } from 'src/wrappers/interfaces/endpoint.interface';
import { GetDhcpForwarderDto } from './dto/get-dhcp-forwarder.dto';
import { GetDnsForwarderDto } from './dto/get-dns-forwarder.dto';
import { GetEdgeGatewayDto } from './dto/get-edge-gateway.dto';
import { UpdateDhcpForwarderDto } from './dto/update-dhcp-forwarder.dto';
import { UpdateDnsForwarderDto } from './dto/update-dns-forwarder.dto';
import { VcloudAcceptEnum } from '../../../../../infrastructure/enum/vcloud-accept.enum';
import { getAccept } from '../../../../../infrastructure/helpers/get-accept.helper';

@Injectable()
export class EdgeGatewayEndpointService {
  name: string;
  constructor() {
    this.name = 'EdgeGatewayEndpointService';
  }

  getDhcpForwarderEndpoint(options: GetDhcpForwarderDto): EndpointInterface {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/dhcpForwarder`,
      params: {},
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  getDnsForwarderEndpoint(options: GetDnsForwarderDto): EndpointInterface {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/dns`,
      params: {},
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  getEdgeGatewayEndpoint(options: GetEdgeGatewayDto): EndpointInterface {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/edgeGateways`,
      params: options.params,
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/* +json;',
        ...options.headers,
      },
    };
  }
  updateDhcpForwarderEndpoint(
    options: UpdateDhcpForwarderDto,
  ): EndpointInterface {
    return {
      method: 'put',
      resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/dhcpForwarder`,
      params: {},
      body: options.body,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  updateDnsForwarderEndpoint(
    options: UpdateDnsForwarderDto,
  ): EndpointInterface {
    return {
      method: 'put',
      resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/dns`,
      params: {},
      body: options.body,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
}
