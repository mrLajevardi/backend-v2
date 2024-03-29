import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface UpdateDhcpBindingDto extends EndpointOptionsInterface {
  urlParams: UpdateDhcpBindingUrlParams;
  body: UpdateDhcpBindingBody;
}

interface UpdateDhcpBindingUrlParams {
  networkId: string;
  bindingId: string;
}

export class UpdateDhcpBindingBody {
  id: string;
  bindingType: string;
  name: string;
  description: string;
  leaseTime: number;
  macAddress: string;
  ipAddress: string;
  dnsServers: string[];
  dhcpV4BindingConfig: DhcpV4BindingConfig;
  version: number;
}

class DhcpV4BindingConfig {
  gatewayIpAddress: string | null;
  hostName: string | null;
}
