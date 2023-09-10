import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface DeleteNatDto extends EndpointOptionsInterface {
  urlParams: DeleteNatUrlParams;
}

interface DeleteNatUrlParams {
  gatewayId: string;
  natId: string;
}
