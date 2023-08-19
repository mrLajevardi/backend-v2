import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface DeleteDhcpDto extends EndpointOptionsInterface {
  urlParams: DeleteDhcpUrlParams;
}

interface DeleteDhcpUrlParams {
  networkId: string;
}
