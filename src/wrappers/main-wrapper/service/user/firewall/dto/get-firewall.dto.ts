import { FirewallActionValue } from '../enum/firewall-action-value.enum';
import {
  ApplicationPortProfile,
  SourceFirewallGroup,
} from './firewall-group.dto';

export interface GetFirewallDto {
  id: string;
  name: string;
  sourceFirewallGroups: null | SourceFirewallGroup[];
  destinationFirewallGroups: null | SourceFirewallGroup[];
  applicationPortProfiles: null | ApplicationPortProfile[];
  ipProtocol: string;
  action: string;
  actionValue: FirewallActionValue;
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
