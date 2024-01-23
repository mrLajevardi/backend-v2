import { EndpointOptionsInterface } from '../../../../../../interfaces/endpoint.interface';

export interface CreateStaticRouteVCloudDto extends EndpointOptionsInterface {
  gatewayId: string;
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
  scope: StaticRouteNextHopScope;
}

export class StaticRouteNextHopScope {
  id: string;
  name: string;
  scopeType: string;
}
