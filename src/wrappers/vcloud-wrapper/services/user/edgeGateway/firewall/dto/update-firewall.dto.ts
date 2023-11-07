import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

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
  ipProtocol: string;
  logging: boolean;
  enabled: boolean;
  sourceFirewallGroups: FirewallGroup[];
  destinationFirewallGroups: FirewallGroup[];
  direction: string;
  actionValue: string;
}

export class ApplicationPortProfile {
  id: string;
  name: string;
}

export class FirewallGroup {
  id: string;
}
