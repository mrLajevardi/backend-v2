import { EndpointOptionsInterface } from '../../../../../../interfaces/endpoint.interface';

export interface DeleteIpSecVpnDto extends EndpointOptionsInterface {
  gatewayId: string;
  ipSecVpnId: string;
}
