import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetIpSetsDto extends EndpointOptionsInterface {
  urlParams: GetIpSetsUrlParams;
}
export interface GetIpSetsUrlParams {
  ipSetId: string;
}
