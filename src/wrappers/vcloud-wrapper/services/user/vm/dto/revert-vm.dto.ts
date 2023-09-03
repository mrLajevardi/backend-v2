import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface RevertVmDto extends EndpointOptionsInterface {
  urlParams: RevertVmUrlParams;
}

interface RevertVmUrlParams {
  vmId: string;
}
