import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface UpdateDhcpDto extends EndpointOptionsInterface {
  urlParams: UpdateDhcpUrlParams;
  body: UpdateDhcpBody;
}

export class UpdateDhcpBody {
  mode: string;
  ipAddress: string;
  leaseTime: number;
  enabled: boolean;
  dnsServers: string[];
  dhcpPools: object;
}

export interface UpdateDhcpUrlParams {
  networkId: string;
}
