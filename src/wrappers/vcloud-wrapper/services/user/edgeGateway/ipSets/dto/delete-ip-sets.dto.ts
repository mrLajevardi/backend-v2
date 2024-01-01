import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface DeleteIpSetsDto extends EndpointOptionsInterface {
  urlParams: DeleteIpSetsUrlParams;
}
export interface DeleteIpSetsUrlParams {
  ipSetId: string;
}
