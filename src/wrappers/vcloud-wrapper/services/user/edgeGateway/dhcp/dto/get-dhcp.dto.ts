import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetDhcpDto extends EndpointOptionsInterface {
  urlParams: GetDhcpUrlParams;
}

interface GetDhcpUrlParams {
  networkId: string;
  bindingId: string;
}
