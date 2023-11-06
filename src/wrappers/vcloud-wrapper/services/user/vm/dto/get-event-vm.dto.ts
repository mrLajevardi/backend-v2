import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetEventVmDto extends EndpointOptionsInterface {
  urlParams: GetEventVmParams;
}

interface GetEventVmParams {
  page: number;
  pageSize: number;
  filterEncoded: true;
  filter: string;
  sortDesc: string;
  links: true;
}
