import { EndpointOptionsInterface } from '../../../../../../interfaces/endpoint.interface';
import { FirewallActionValue } from '../../../../../../main-wrapper/service/user/firewall/enum/firewall-action-value.enum';
import { FirewallDirectionEnum } from '../enum/firewall-direction.enum';
import { FirewallIpProtocolEnum } from '../enum/firewall-ip-protocol.enum';
import { ApplicationPortProfile } from './update-firewall.dto';

export interface CreateFirewallDto extends EndpointOptionsInterface {
  body: CreateFirewallBody;
  urlParams: CreateFirewallUrlParams;
}

export interface CreateFirewallUrlParams {
  gatewayId: string;
}

export interface CreateFirewallBody {
  name: string;
  actionValue: FirewallActionValue;
  active: boolean;
  sourceFirewallGroups: FirewallGroup[];
  destinationFirewallGroups: FirewallGroup[];
  sourceFirewallIpAddresses: string[] | null;
  destinationFirewallIpAddresses: string[] | null;
  applicationPortProfiles: ApplicationPortProfile[];
  ipProtocol: FirewallIpProtocolEnum;
  logging: boolean;
  direction: FirewallDirectionEnum;
  comments: string;
  networkContextProfiles: null;
  rawPortProtocols: RawPortProtocol[] | null;
  relativePosition: RelativePosition;
}

export interface FirewallGroup {
  id: string;
  name?: string;
}

export interface RawPortProtocol {
  layer4Item: Layer4Item;
}

export interface Layer4Item {
  protocol: string;
  sourcePorts: string[];
  destinationPorts: string[];
}

export interface RelativePosition {
  adjacentRuleId: string;
  rulePosition: string;
}
