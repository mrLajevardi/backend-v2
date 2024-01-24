import { Injectable } from '@nestjs/common';
import {
  CreateStaticRouteDto,
  StaticRouteNextHops,
} from './dto/create-static-route.dto';
import { StaticRouteEndpointService } from '../../../../vcloud-wrapper/services/user/edgeGateway/staticRoute/static-route-endpoint.service';
import {
  CreateStaticRouteBody,
  CreateStaticRouteVCloudDto,
} from '../../../../vcloud-wrapper/services/user/edgeGateway/staticRoute/dto/create-static-route.dto';
import { VcloudWrapperService } from '../../../../vcloud-wrapper/services/vcloud-wrapper.service';
import { VcloudWrapperInterface } from '../../../../vcloud-wrapper/interface/vcloud-wrapper.interface';
import { EndpointInterface } from '../../../../interfaces/endpoint.interface';
import { GetStaticRouteDto } from '../../../../vcloud-wrapper/services/user/edgeGateway/staticRoute/dto/get-static-route.dto';
import { FindStaticRouteDto } from '../../../../vcloud-wrapper/services/user/edgeGateway/staticRoute/dto/find-static-route.dto';
import { UpdateStaticRouteVCloudDto } from '../../../../vcloud-wrapper/services/user/edgeGateway/staticRoute/dto/update-static-route.dto';
import { UpdateStaticRouteDto } from './dto/update-static-route.dto';

@Injectable()
export class StaticRouteWrapperService {
  constructor(private readonly vcloudWrapperService: VcloudWrapperService) {}

  async create(authToken: string, dto: CreateStaticRouteDto) {
    const staticRouteDto: CreateStaticRouteVCloudDto = {
      gatewayId: dto.gatewayId,
      body: {
        name: dto.name,
        description: dto.description ?? null,
        networkCidr: dto.networkCidr,
        nextHops: dto.nextHops,
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const endPoint = 'StaticRouteEndpointService';
    const wrapper =
      this.vcloudWrapperService.getWrapper<'StaticRouteEndpointService'>(
        'StaticRouteEndpointService',
      );

    const endpoint = wrapper.createStaticRouteEndpoint(staticRouteDto);

    const staticRoute = await this.vcloudWrapperService.request(endpoint);

    return Promise.resolve({
      __vcloudTask: staticRoute.headers.location,
    });
  }

  async update(authToken: string, dto: UpdateStaticRouteDto) {
    const staticRouteDto: UpdateStaticRouteVCloudDto = {
      gatewayId: dto.gatewayId,
      routeId: dto.routeId,
      body: {
        name: dto.name,
        description: dto.description ?? null,
        networkCidr: dto.networkCidr,
        nextHops: dto.nextHops,
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const wrapper =
      this.vcloudWrapperService.getWrapper<'StaticRouteEndpointService'>(
        'StaticRouteEndpointService',
      );

    const endPoint = wrapper.updateStaticRouteEndpoint(staticRouteDto);

    const staticRoute = await this.vcloudWrapperService.request(endPoint);

    return Promise.resolve({
      __vcloudTask: staticRoute.headers.location,
    });
  }
  async get(authToken: string, gatewayId: string, pageSize = 25) {
    const wrapper =
      this.vcloudWrapperService.getWrapper<'StaticRouteEndpointService'>(
        'StaticRouteEndpointService',
      );
    const staticRouteDto: GetStaticRouteDto = {
      urlParams: {
        pageSize: pageSize,
      },
      gatewayId: gatewayId,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const endPoint = wrapper.getStaticRouteEndPoint(staticRouteDto);

    const staticRoute = await this.vcloudWrapperService.request(endPoint);

    return Promise.resolve({
      data: staticRoute.data['values'],
    });
  }

  async find(authToken: string, gatewayId: string, routeId: string) {
    const wrapper =
      this.vcloudWrapperService.getWrapper<'StaticRouteEndpointService'>(
        'StaticRouteEndpointService',
      );

    const staticRouteDto: FindStaticRouteDto = {
      gatewayId: gatewayId,
      routeId: routeId,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const endPoint = wrapper.findStaticRouteEndPoint(staticRouteDto);

    const staticRoute = await this.vcloudWrapperService.request(endPoint);

    return Promise.resolve({
      data: staticRoute.data,
    });
  }
}
