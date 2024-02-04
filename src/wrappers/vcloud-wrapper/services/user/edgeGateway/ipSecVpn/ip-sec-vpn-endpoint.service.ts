import { Injectable } from '@nestjs/common';
import { EndpointInterface } from '../../../../../interfaces/endpoint.interface';
import { getAccept } from '../../../../../../infrastructure/helpers/get-accept.helper';
import { VcloudAcceptEnum } from '../../../../../../infrastructure/enum/vcloud-accept.enum';
import { CreateIpSecVpnDto } from './dto/create-ip-sec-vpn.dto';
import { GetIpSecVpnDto } from './dto/get-ip-sec-vpn.dto';
import { FindIpSecVpnDto } from './dto/find-ip-sec-vpn.dto';
import { UpdateIpSecVpnDto } from './dto/update-ip-sec-vpn.dto';
import { DeleteIpSecVpnDto } from './dto/delete-ip-sec-vpn.dto';
import { GetDefaultConnectionPropertyDto } from './dto/get-default-connection-property.dto';
import { GetIpSecVpnConnectionPropertyDto } from './dto/get-ip-sec-vpn-connection-property.dto';
import { UpdateIpSecVpnConnectionPropertyDto } from './dto/update-ip-sec-vpn-connection-property.dto';

@Injectable()
export class IpSecVpnEndpointService {
  name: string;

  constructor() {
    this.name = 'IpSecVpnEndpointService';
  }

  createIpSecVpnEndpoint(options: CreateIpSecVpnDto): EndpointInterface {
    return {
      method: 'POST',
      resource: `/cloudapi/2.0.0/edgeGateways/${options.gatewayId}/ipsec/tunnels`,
      params: {},
      body: options.body,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }

  updateIpSecVpnEndpoint(options: UpdateIpSecVpnDto): EndpointInterface {
    return {
      method: 'PUT',
      resource: `/cloudapi/2.0.0/edgeGateways/${options.gatewayId}/ipsec/tunnels/${options.ipSecVpnId}`,
      params: {},
      body: options.body,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }

  getIpSecVpnEndPoint(options: GetIpSecVpnDto): EndpointInterface {
    return {
      method: 'GET',
      resource: `/cloudapi/2.0.0/edgeGateways/${options.gatewayId}/ipsec/tunnels`,
      params: {},
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }

  findIpSecVpnEndPoint(options: FindIpSecVpnDto): EndpointInterface {
    return {
      method: 'GET',
      resource: `/cloudapi/2.0.0/edgeGateways/${options.gatewayId}/ipsec/tunnels/${options.ipSecVpnId}`,
      params: {},
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }

  deleteIpSecVpnEndPoint(options: DeleteIpSecVpnDto): EndpointInterface {
    return {
      method: 'DELETE',
      resource: `/cloudapi/2.0.0/edgeGateways/${options.gatewayId}/ipsec/tunnels/${options.ipSecVpnId}`,
      params: {},
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }

  getDefaultConnectionProperty(
    options: GetDefaultConnectionPropertyDto,
  ): EndpointInterface {
    return {
      method: 'GET',
      resource: `/cloudapi/2.0.0/edgeGateways/${options.gatewayId}/ipsec/tunnels/defaultConnectionProperties`,
      params: {},
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }

  getIpSecVpnConnectionProperty(
    options: GetIpSecVpnConnectionPropertyDto,
  ): EndpointInterface {
    return {
      method: 'GET',
      resource: `/cloudapi/2.0.0/edgeGateways/${options.gatewayId}/ipsec/tunnels/${options.ipSecVpnId}/connectionProperties`,
      params: {},
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }

  updateConnectionProperty(
    options: UpdateIpSecVpnConnectionPropertyDto,
  ): EndpointInterface {
    return {
      method: 'PUT',
      resource: `/cloudapi/2.0.0/edgeGateways/${options.gatewayId}/ipsec/tunnels/${options.ipSecVpnId}/connectionProperties`,
      params: {},
      body: options.body,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }

  getIpSecVpnStatusEndPoint(options: FindIpSecVpnDto): EndpointInterface {
    return {
      method: 'GET',
      resource: `/cloudapi/2.0.0/edgeGateways/${options.gatewayId}/ipsec/tunnels/${options.ipSecVpnId}/status`,
      params: {},
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  getIpSecVpnStatisticsEndPoint(options: FindIpSecVpnDto): EndpointInterface {
    return {
      method: 'GET',
      resource: `/cloudapi/2.0.0/edgeGateways/${options.gatewayId}/ipsec/tunnels/${options.ipSecVpnId}/statistics`,
      params: {},
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
}
