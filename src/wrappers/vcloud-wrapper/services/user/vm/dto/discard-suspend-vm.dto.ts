import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface DiscardSuspendVmDto extends EndpointOptionsInterface {
  urlParams: DiscardSuspendVmUrlParams;
}

interface DiscardSuspendVmUrlParams {
  vmId: string;
}
