import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface DeleteNetworkDto extends EndpointOptionsInterface {
  urlParams: DeleteNetworkUrlParams;
}

export interface DeleteNetworkUrlParams {
  networkId: string;
}
