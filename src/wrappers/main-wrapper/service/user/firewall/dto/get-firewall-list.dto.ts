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
  ruleType: string;
  enabled: boolean;
  description: string;
}

export interface GetFirewallListDto {
  systemRules: null | Rule[];
  userDefinedRules: Rule[] | null;
  defaultRules: Rule[] | null;
}
