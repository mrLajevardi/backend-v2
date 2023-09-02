import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetExternalNetworksDto extends EndpointOptionsInterface {
  params: GetExternalNetworksParams;
}

interface GetExternalNetworksParams {
  page: number;
  pageSize: number;
}
