import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface SuspendVmDto extends EndpointOptionsInterface {
  urlParams: SuspendVmUrlParams;
}

interface SuspendVmUrlParams {
  vmId: string;
}
