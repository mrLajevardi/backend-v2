import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetNetworkIpUsageListDto extends EndpointOptionsInterface {
  urlParams: GetNetworkIpUsageListUrlParams;
  params: GetNetworkIpUsageListParams;
}

export interface GetNetworkIpUsageListUrlParams {
  networkId: string;
}

export interface GetNetworkIpUsageListParams {
  page: number;
  pageSize: number;
}
