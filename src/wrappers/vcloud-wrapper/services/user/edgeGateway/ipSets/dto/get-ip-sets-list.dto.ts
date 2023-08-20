import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetIpSetsListDto extends EndpointOptionsInterface {
  urlParams: GetIpSetsListUrlParams;
  params: GetIpSetsListParams;
}
export interface GetIpSetsListUrlParams {
  ipSetId: string;
}

export interface GetIpSetsListParams {
  page: number;
  pageSize: number;
  filter: string;
  sortAsc: string;
}
