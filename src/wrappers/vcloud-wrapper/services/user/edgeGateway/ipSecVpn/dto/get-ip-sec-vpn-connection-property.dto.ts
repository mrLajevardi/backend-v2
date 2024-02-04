import { EndpointOptionsInterface } from '../../../../../../interfaces/endpoint.interface';

export interface GetIpSecVpnConnectionPropertyDto
  extends EndpointOptionsInterface {
  gatewayId: string;
  ipSecVpnId: string;
}
