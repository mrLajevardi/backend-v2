import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';
import { UpdateFirewallBody } from './update-firewall.dto';

export interface UpdateFirewallListDto extends EndpointOptionsInterface {
  urlParams: UpdateFirewallListUrlParams;
  body: UpdateFirewallListBody;
}

interface UpdateFirewallListUrlParams {
  gatewayId: string;
}

export class UpdateFirewallListBody {
  userDefinedRules: UpdateFirewallBody[];
  defaultRules?: UpdateFirewallBody[];
}
