import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetFirewallListDto extends EndpointOptionsInterface {
  urlParams: GetFirewallListUrlParams;
}

interface GetFirewallListUrlParams {
  gatewayId: string;
}
