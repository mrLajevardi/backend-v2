import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetHardwareInfoOptionsDto extends EndpointOptionsInterface {
  urlParams: GetHardwareInfoUrlParams;
}

export interface GetHardwareInfoUrlParams {
  vdcId: string;
}
