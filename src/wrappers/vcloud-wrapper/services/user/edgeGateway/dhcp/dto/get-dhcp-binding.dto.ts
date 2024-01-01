import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetDhcpBindingsDto extends EndpointOptionsInterface {
  urlParams: GetDhcpBindingsUrlParams;
}

interface GetDhcpBindingsUrlParams {
  networkId: string;
  bindingId: string;
}
