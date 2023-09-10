export interface GetDhcpBindingDto {
  id: string;
  name: string;
  description: string;
  macAddress: string;
  ipAddress: string;
  leaseTime: number;
  dnsServers: string[];
  bindingType: string;
  dhcpV4BindingConfig: DhcpV4BindingConfig;
  dhcpV6BindingConfig: null;
  version: Version;
}

interface DhcpV4BindingConfig {
  gatewayIpAddress: null | string;
  hostName: string;
}

interface Version {
  version: number;
}
