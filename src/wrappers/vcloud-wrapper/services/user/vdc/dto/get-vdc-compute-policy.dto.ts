import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetVdcComputePolicyDto extends EndpointOptionsInterface {
  urlParams: GetVdcComputePolicyUrlParams;
  params: GetVdcComputePolicyParams;
}

interface GetVdcComputePolicyUrlParams {
  vdcId: string;
}

interface GetVdcComputePolicyParams {
  page: number;
  pageSize: number;
}
