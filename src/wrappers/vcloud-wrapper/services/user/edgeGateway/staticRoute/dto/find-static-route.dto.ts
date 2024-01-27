import { EndpointOptionsInterface } from '../../../../../../interfaces/endpoint.interface';

export interface FindStaticRouteDto extends EndpointOptionsInterface {
  gatewayId: string;

  routeId: string;
}
