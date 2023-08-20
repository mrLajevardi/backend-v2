import { Injectable } from '@nestjs/common';
import { DeleteFirewallDto } from './dto/delete-firewall.dto';
import { EndpointInterface } from 'src/wrappers/interfaces/endpoint.interface';
import { GetFirewallDto } from './dto/get-firewall.dto';
import { GetFirewallListDto } from './dto/get-firewall-list.dto';
import { UpdateFirewallDto } from './dto/update-firewall.dto';
import { UpdateFirewallListDto } from './dto/update-firewall-list.dto';

@Injectable()
export class FirewallEndpointService {
  deleteFirewallEndpoint(options: DeleteFirewallDto): EndpointInterface {
    return {
      method: 'delete',
      resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/firewall/rules/${options.urlParams.ruleId}`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
  getFirewallEndpoint(options: GetFirewallDto): EndpointInterface {
    return {
      method: 'get',
      // eslint-disable-next-line max-len
      resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/firewall/rules/${options.urlParams.ruleId}`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
  getFirewallListEndpoint(options: GetFirewallListDto): EndpointInterface {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/firewall/rules`,
      params: {},
      body: null,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
  updateFirewallEndpoint(options: UpdateFirewallDto): EndpointInterface {
    return {
      method: 'put',
      // eslint-disable-next-line max-len
      resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/firewall/rules/${options.urlParams.ruleId}`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
  updateFirewallListEndpoint(
    options: UpdateFirewallListDto,
  ): EndpointInterface {
    return {
      method: 'put',
      resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.gatewayId}/firewall/rules`,
      params: {},
      body: options.body,
      headers: {
        Accept: 'application/json;version=38.0.0-alpha',
        ...options.headers,
      },
    };
  }
}
