import { EndpointOptionsInterface } from '../../../../../../interfaces/endpoint.interface';

export interface CreateIpSecVpnDto extends EndpointOptionsInterface {
  gatewayId: string;
  body: CreateIpSecVpnBody;
}

export class CreateIpSecVpnBody {
  name: string;
  description: string;
  securityType = 'DEFAULT';
  active = true;
  logging = false;
  authenticationMode: string;
  preSharedKey: string;
  certificateRef?: string | null;
  caCertificateRef?: string | null;
  localEndpoint: CreateIpSecVpnLocalEndpointBody;
  remoteEndpoint: CreateIpSecVpnRemoteEndpointBody;
}
export class CreateIpSecVpnLocalEndpointBody {
  localId: string;
  localAddress: string;
  localNetworks: string[];
}

export class CreateIpSecVpnRemoteEndpointBody {
  remoteId: string;
  remoteAddress: string;
  remoteNetworks: string[];
}
