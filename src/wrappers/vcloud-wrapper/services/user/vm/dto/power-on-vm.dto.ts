import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface PowerOnVmDto extends EndpointOptionsInterface {
  urlParams: PowerOnVmUrlParams;
}

interface PowerOnVmUrlParams {
  vmId: string;
}
