interface DhcpBinding {
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

// interface DhcpV6BindingConfig {
//   // Define properties specific to DHCPv6 configuration if available
// }

interface Version {
  version: number;
}

export interface GetAllDhcpBindingDto {
  values: DhcpBinding[];
}
