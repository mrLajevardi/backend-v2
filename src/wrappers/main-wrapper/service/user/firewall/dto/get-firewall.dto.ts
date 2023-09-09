import {
  ApplicationPortProfile,
  SourceFirewallGroup,
} from './firewall-group.dto';

export interface GetFirewallDto {
  id: string;
  name: string;
  description: string;
  sourceFirewallGroups: null | SourceFirewallGroup[];
  destinationFirewallGroups: null | SourceFirewallGroup[];
  applicationPortProfiles: null | ApplicationPortProfile[];
  ipProtocol: string;
  action: string;
  actionValue: string;
  direction: string;
  logging: boolean;
  networkContextProfiles: null; // Define the type if available
  enabled: boolean;
  version: Version;
  comments: string;
  appliedTo: null; // Define the type if available
}

interface Version {
  version: number;
}
