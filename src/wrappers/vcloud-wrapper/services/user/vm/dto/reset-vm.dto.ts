import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface ResetVmDto extends EndpointOptionsInterface {
  urlParams: ResetVmUrlParams;
}

interface ResetVmUrlParams {
  vmId: string;
}
