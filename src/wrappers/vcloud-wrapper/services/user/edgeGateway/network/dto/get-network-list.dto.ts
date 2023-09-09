import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetNetworkListDto extends EndpointOptionsInterface {
  params: GetNetworkListParams;
}
export interface GetNetworkListParams {
  page: number;
  pageSize: number;
}
