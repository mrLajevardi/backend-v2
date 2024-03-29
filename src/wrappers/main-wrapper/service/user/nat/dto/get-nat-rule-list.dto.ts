import { NatFirewallMatchEnum } from '../enum/nat-firewall-match.enum';

interface FirewallRuleDetail {
  id: string;
  name: string;
  description: null | string;
  enabled: boolean;
  ruleType: string;
  type: string;
  applicationPortProfile: null | ApplicationPortProfile;
  externalAddresses: string;
  internalAddresses: null | string;
  dnatExternalPort: null | number;
  logging: boolean;
  systemRule: boolean;
  snatDestinationAddresses: null | string;
  firewallMatch: NatFirewallMatchEnum;
  priority: number;
  version: Version;
  appliedTo: null; // Define the type if available
}

interface ApplicationPortProfile {
  name: string;
  id: string;
}

interface Version {
  version: number;
}

export interface GetNatRuleListDto {
  status: string;
  values: FirewallRuleDetail[];
}
