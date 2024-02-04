import { EndpointOptionsInterface } from '../../../../../../interfaces/endpoint.interface';

export interface UpdateIpSecVpnDto extends EndpointOptionsInterface {
  gatewayId: string;
  ipSecVpnId: string;
  body: UpdateIpSecVpnBody;
}

export class UpdateIpSecVpnBody {
  id: string;
  name: string;
  description: string;
  securityType = 'DEFAULT';
  active = true;
  logging = false;
  authenticationMode: string;
  preSharedKey: string;
  certificateRef?: string | null;
  caCertificateRef?: string | null;
  localEndpoint: UpdateIpSecVpnLocalEndpointBody;
  remoteEndpoint: UpdateIpSecVpnRemoteEndpointBody;
}
export class UpdateIpSecVpnLocalEndpointBody {
  localId: string;
  localAddress: string;
  localNetworks: string[];
}

export class UpdateIpSecVpnRemoteEndpointBody {
  remoteId: string;
  remoteAddress: string;
  remoteNetworks: string[];
}
