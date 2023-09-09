import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetVmTemplatesDto extends EndpointOptionsInterface {
  urlParams: GetVmTemplatesUrlParams;
}

interface GetVmTemplatesUrlParams {
  vmId: string;
}
