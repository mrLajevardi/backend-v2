import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface UpdateVmDto extends EndpointOptionsInterface {
  urlParams: UpdateVmUrlParams;
  body: string;
}

interface UpdateVmUrlParams {
  vmId: string;
}
