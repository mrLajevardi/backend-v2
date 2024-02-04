import { EndpointOptionsInterface } from '../../../../../../interfaces/endpoint.interface';

export interface GetIpSecVpnDto extends EndpointOptionsInterface {
  gatewayId: string;
}
