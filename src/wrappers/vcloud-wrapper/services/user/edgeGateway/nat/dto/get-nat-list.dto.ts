import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetNatListDto extends EndpointOptionsInterface {
  urlParams: GetNatUrlParams;
  params: GetNatParams;
}

interface GetNatUrlParams {
  gatewayId: string;
}

interface GetNatParams {
  pageSize: number;
  cursor: string;
}
