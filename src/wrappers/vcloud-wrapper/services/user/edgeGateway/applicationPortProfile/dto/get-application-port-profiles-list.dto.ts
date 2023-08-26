import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetApplicationPortProfilesListDto
  extends EndpointOptionsInterface {
  params: GetApplicationPortProfilesParams;
}

interface GetApplicationPortProfilesParams {
  page: number;
  pageSize: number;
  filter: string;
}
