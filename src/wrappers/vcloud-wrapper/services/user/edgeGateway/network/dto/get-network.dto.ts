import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetNetworkDto extends EndpointOptionsInterface {
  urlParams: GetNetworkUrlParams;
}

export interface GetNetworkUrlParams {
  networkId: string;
}
