import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetProviderVdcsDto extends EndpointOptionsInterface {
  params: GetProviderVdcsParams;
}

interface GetProviderVdcsParams {
  filter?: string;
  sortAsc?: string;
  sortDesc?: string;
  page: number;
  pageSize: number;
}
