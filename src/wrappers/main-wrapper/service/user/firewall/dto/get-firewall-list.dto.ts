import { FirewallDirectionEnum } from '../../../../../vcloud-wrapper/services/user/edgeGateway/firewall/enum/firewall-direction.enum';
import { FirewallIpProtocolEnum } from '../../../../../vcloud-wrapper/services/user/edgeGateway/firewall/enum/firewall-ip-protocol.enum';
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
  ipProtocol: FirewallIpProtocolEnum;
  logging: boolean;
  direction: FirewallDirectionEnum;
}

export interface GetFirewallListDto {
  systemRules: null | Rule[];
  userDefinedRules: Rule[] | null;
  defaultRules: Rule[] | null;
}
