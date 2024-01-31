import { EndpointOptionsInterface } from '../../../../../../interfaces/endpoint.interface';

export interface GetStaticRouteDto extends EndpointOptionsInterface {
  gatewayId: string;
  urlParams: {
    pageSize: number;
  };
}
