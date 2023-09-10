import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface DeleteVmDto extends EndpointOptionsInterface {
  urlParams: DeleteVmUrlParams;
}

interface DeleteVmUrlParams {
  vmId: string;
}
