interface ForwarderZone {
  id: string;
  displayName: string;
  dnsDomainNames: null | string[];
  upstreamServers: string[];
}

export interface GetDnsForwarderDto {
  enabled: boolean;
  listenerIp: string;
  defaultForwarderZone: ForwarderZone;
  conditionalForwarderZones: null | any; // Define the type if available
  version: Version;
  snatRuleExternalIpAddress: string;
  snatRuleEnabled: boolean;
}

interface Version {
  version: number;
}
