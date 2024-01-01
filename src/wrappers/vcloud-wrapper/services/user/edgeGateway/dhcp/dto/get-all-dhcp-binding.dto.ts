import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetAllDhcpBindingsDto extends EndpointOptionsInterface {
  urlParams: GetAllDhcpBindingsUrlParams;
  params: GetAllDhcpBindingsParams;
}

interface GetAllDhcpBindingsUrlParams {
  networkId: string;
}

interface GetAllDhcpBindingsParams {
  pageSize: number;
  cursor: string;
}
