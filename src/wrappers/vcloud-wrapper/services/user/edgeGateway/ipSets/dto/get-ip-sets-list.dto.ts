import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetIpSetsListDto extends EndpointOptionsInterface {
  params: GetIpSetsListParams;
}

export interface GetIpSetsListParams {
  page: number;
  pageSize: number;
  filter: string;
  sortAsc: string;
}
