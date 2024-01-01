import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetAvailableIpAddressesDto extends EndpointOptionsInterface {
  urlParams: GetAvailableIpAddressesUrlParams;
}

interface GetAvailableIpAddressesUrlParams {
  externalNetworkId: string;
}
