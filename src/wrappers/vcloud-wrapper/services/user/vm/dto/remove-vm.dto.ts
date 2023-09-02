import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface RemoveVmDto extends EndpointOptionsInterface {
  urlParams: RemoveVmUrlParams;
}

interface RemoveVmUrlParams {
  vmId: string;
}
