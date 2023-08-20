import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetNatDto extends EndpointOptionsInterface {
  urlParams: GetNatUrlParams;
}

interface GetNatUrlParams {
  gatewayId: string;
  natId: string;
}
