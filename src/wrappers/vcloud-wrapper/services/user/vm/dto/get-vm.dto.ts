import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetVmDto extends EndpointOptionsInterface {
  urlParams: GetVmUrlParams;
}

interface GetVmUrlParams {
  vmId: string;
}
