import { Injectable } from '@nestjs/common';
import { EndpointInterface } from '../../../../../interfaces/endpoint.interface';
import { getAccept } from '../../../../../../infrastructure/helpers/get-accept.helper';
import { VcloudAcceptEnum } from '../../../../../../infrastructure/enum/vcloud-accept.enum';
import { CreateStaticRouteVCloudDto } from './dto/create-static-route.dto';
import { WrapperProvider } from '../../../../interface/vcloud-wrapper.interface';
import { GetStaticRouteDto } from './dto/get-static-route.dto';
import { FindStaticRouteDto } from './dto/find-static-route.dto';

@Injectable()
export class StaticRouteEndpointService {
  name: string;

  constructor() {
    this.name = 'StaticRouteEndpointService';
  }

  createStaticRouteEndpoint(
    options: CreateStaticRouteVCloudDto,
  ): EndpointInterface {
    return {
      method: 'POST',
      resource: `/cloudapi/2.0.0/edgeGateways/${options.gatewayId}/routing/staticRoutes`,
      params: {},
      body: options.body,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }

  getStaticRouteEndPoint(options: GetStaticRouteDto): EndpointInterface {
    return {
      method: 'GET',
      resource: `/cloudapi/2.0.0/edgeGateways/${options.gatewayId}/routing/staticRoutes`,
      params: {
        pageSize: options.urlParams.pageSize ?? 25,
      },
      body: null,
      headers: {
        Accept: getAccept(VcloudAcceptEnum.Json),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
  }
  findStaticRouteEndPoint(options: FindStaticRouteDto): EndpointInterface {
    return {
      method: 'GET',
      resource: `/cloudapi/2.0.0/edgeGateways/${options.gatewayId}/routing/staticRoutes/${options.routeId}`,
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
