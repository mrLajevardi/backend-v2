import { Injectable } from '@nestjs/common';
import { CreateEdgeGatewayDto } from './dto/create-edge-gateway.dto';
import { EndpointInterface } from 'src/wrappers/interfaces/endpoint.interface';
import { GetAvailableIpAddressesDto } from './dto/get-available-ip-addresses.dto';
import { GetExternalNetworksDto } from './dto/get-external-networks.dto';
import { GetNsxtEdgeClustersDto } from './dto/get-nsxt-edge-cluster.dto';
import { UpdateEdgeGatewayDto } from './dto/update-edge-gateway.dto';
import { getAccept } from '../../../../../infrastructure/helpers/get-accept.helper';
import { VcloudAcceptEnum } from '../../../../../infrastructure/enum/vcloud-accept.enum';

@Injectable()
export class AdminEdgeGatewayEndpointService {
  name: string;
  constructor() {
    this.name = 'AdminEdgeGatewayEndpointService';
  }
  createEdgeGatewayEndpoint(options: CreateEdgeGatewayDto): EndpointInterface {
    return {
      method: 'post',
      resource: `/cloudapi/1.0.0/edgeGateways`,
      params: {},
      body: options.body,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  getAvailableIpAddressesEndpoint(
    options: GetAvailableIpAddressesDto,
  ): EndpointInterface {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/externalNetworks/${options.urlParams.externalNetworkId}/availableIpAddresses`,
      params: {},
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  getExternalNetworksEndpoint(
    options: GetExternalNetworksDto,
  ): EndpointInterface {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/externalNetworks`,
      params: options.params,
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  getNsxtEdgeClustersEndpoint(
    options: GetNsxtEdgeClustersDto,
  ): EndpointInterface {
    return {
      method: 'get',
      resource: `/cloudapi/1.0.0/nsxTResources/edgeClusters`,
      params: options.params,
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }

  updateEdgeGatewayEndpoint(options: UpdateEdgeGatewayDto): EndpointInterface {
    return {
      method: 'put',
      resource: `/cloudapi/1.0.0/edgeGateways/${options.urlParams.edgeId}`,
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
