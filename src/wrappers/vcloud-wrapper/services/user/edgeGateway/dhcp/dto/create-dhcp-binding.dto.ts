import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface CreateDhcpBindingDto extends EndpointOptionsInterface {
  urlParams: CreateDhcpBindingUrlParams;
  body: CreateDhcpBindingBody;
}

interface CreateDhcpBindingUrlParams {
  networkId: string;
}

export class CreateDhcpBindingBody {
  bindingType: string;
  name: string;
  description: string;
  leaseTime: number;
  macAddress: string;
  ipAddress: string;
  dnsServers: Array<string | void>;
  dhcpV4BindingConfig: DhcpV4BindingConfig;
}

class DhcpV4BindingConfig {
  gatewayIpAddress: string | null;
  hostName: string | null;
}
