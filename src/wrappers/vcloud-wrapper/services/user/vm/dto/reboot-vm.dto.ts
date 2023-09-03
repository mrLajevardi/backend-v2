import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface RebootVmDto extends EndpointOptionsInterface {
  urlParams: RebootVmUrlParams;
}

interface RebootVmUrlParams {
  vmId: string;
}
