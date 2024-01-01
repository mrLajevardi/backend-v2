import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetNsxtEdgeClustersDto extends EndpointOptionsInterface {
  params: GetNsxtEdgeClustersParams;
}

interface GetNsxtEdgeClustersParams {
  page: number;
  pageSize: number;
  filter: string;
}
