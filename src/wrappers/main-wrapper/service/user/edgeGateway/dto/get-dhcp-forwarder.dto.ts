export interface GetDhcpForwarderDto {
  enabled: boolean;
  dhcpServers: string[];
  version: Version;
}

interface Version {
  version: number;
}
