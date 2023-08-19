export interface UpdateDhcpDto {
  urlParams: object;
  body: object;
}

export class UpdateDhcpBody {
  mode: string;
  ipAddress: string;
  leaseTime: number;
  enable: boolean;
  dnsServers: Array<void | string>;
  dhcpPools
}
