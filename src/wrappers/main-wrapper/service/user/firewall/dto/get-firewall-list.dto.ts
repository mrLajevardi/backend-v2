import { FirewallActionValue } from '../enum/firewall-action-value.enum';
import {
  ApplicationPortProfile,
  SourceFirewallGroup,
} from './firewall-group.dto';

interface Rule {
  id: string;
  name: string;
  destinationFirewallGroups: null | SourceFirewallGroup[];
  sourceFirewallGroups: null | SourceFirewallGroup[];
  applicationPortProfiles: null | ApplicationPortProfile[];
  actionValue: FirewallActionValue;
  enabled: boolean;
  description: string;
  comments: string;
  ipProtocol: string;
  logging: boolean;
  direction: string;
}

export interface GetFirewallListDto {
  systemRules: null | Rule[];
  userDefinedRules: Rule[] | null;
  defaultRules: Rule[] | null;
}
