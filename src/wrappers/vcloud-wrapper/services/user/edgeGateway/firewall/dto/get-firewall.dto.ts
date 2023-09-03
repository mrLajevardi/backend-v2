import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetFirewallDto extends EndpointOptionsInterface {
  urlParams: GetFirewallUrlParams;
}

interface GetFirewallUrlParams {
  gatewayId: string;
  ruleId: string;
}
