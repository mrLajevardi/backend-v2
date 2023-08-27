export interface GetNatRuleDto {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  ruleType: string;
  type: string;
  applicationPortProfile: null | ApplicationPortProfile;
  externalAddresses: string;
  internalAddresses: string;
  dnatExternalPort: null | string;
  logging: boolean;
  systemRule: boolean;
  snatDestinationAddresses: null | string;
  firewallMatch: string;
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
