import { EndpointOptionsInterface } from '../../../../../../interfaces/endpoint.interface';

export interface GetDefaultConnectionPropertyDto
  extends EndpointOptionsInterface {
  gatewayId: string;
}
