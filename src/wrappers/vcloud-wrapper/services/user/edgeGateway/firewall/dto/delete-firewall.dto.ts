import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface DeleteFirewallDto extends EndpointOptionsInterface {
  urlParams: DeleteFirewallUrlParams;
}

interface DeleteFirewallUrlParams {
  ruleId: string;
  gatewayId: string;
}
