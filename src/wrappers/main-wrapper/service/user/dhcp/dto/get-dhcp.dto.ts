interface DhcpPool {
  enabled: boolean;
  ipRange: IpRange;
  maxLeaseTime: null | number;
  defaultLeaseTime: null | number;
}

interface IpRange {
  startAddress: string;
  endAddress: string;
}

export interface GetDhcpDto {
  enabled: boolean;
  leaseTime: number;
  dhcpPools: DhcpPool[];
  mode: string;
  ipAddress: null | string;
  dnsServers: string[];
}
