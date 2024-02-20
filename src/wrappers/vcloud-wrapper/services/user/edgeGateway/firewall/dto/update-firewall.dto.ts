import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';
import { FirewallDirectionEnum } from '../enum/firewall-direction.enum';
import { FirewallIpProtocolEnum } from '../enum/firewall-ip-protocol.enum';
import { FirewallActionValue } from '../../../../../../main-wrapper/service/user/firewall/enum/firewall-action-value.enum';

export interface UpdateFirewallDto extends EndpointOptionsInterface {
  urlParams: UpdateFirewallUrlParams;
  body: UpdateFirewallBody;
}

interface UpdateFirewallUrlParams {
  ruleId: string;
  gatewayId: string;
}

export class UpdateFirewallBody {
  id?: string;
  name: string;
  applicationPortProfiles: ApplicationPortProfile[];
  comments: string;
  ipProtocol: FirewallIpProtocolEnum;
  logging: boolean;
  enabled: boolean;
  sourceFirewallGroups: FirewallGroup[];
  destinationFirewallGroups: FirewallGroup[];
  direction: FirewallDirectionEnum;
  actionValue: FirewallActionValue;
}

export class ApplicationPortProfile {
  id: string;
  name: string;
}

export class FirewallGroup {
  id: string;
}
