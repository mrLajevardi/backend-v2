import { EndpointOptionsInterface } from '../../../../../../interfaces/endpoint.interface';

export interface UpdateStaticRouteVCloudDto extends EndpointOptionsInterface {
  gatewayId: string;
  routeId: string;
  body: CreateStaticRouteBody;
}

export class CreateStaticRouteBody {
  name: string;
  description: string;
  networkCidr: string;
  nextHops: StaticRouteNextHop[];
}

export class StaticRouteNextHop {
  adminDistance: number;
  ipAddress: string;
  scope?: StaticRouteNextHopScope;
}

export class StaticRouteNextHopScope {
  id: string;
  name: string;
  scopeType: string;
}
