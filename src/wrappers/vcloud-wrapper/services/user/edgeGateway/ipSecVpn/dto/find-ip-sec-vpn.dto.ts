import { EndpointOptionsInterface } from '../../../../../../interfaces/endpoint.interface';

export interface FindIpSecVpnDto extends EndpointOptionsInterface {
  gatewayId: string;
  ipSecVpnId: string;
}
