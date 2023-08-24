import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface UndeployVmDto extends EndpointOptionsInterface {
  urlParams: UndeployVmUrlParams;
  body: string;
}

interface UndeployVmUrlParams {
  vmId: string;
}
