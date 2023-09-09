import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface DisableVdcDto extends EndpointOptionsInterface {
  urlParams: DisableVdcUrlParams;
}

interface DisableVdcUrlParams {
  vdcId: string;
}
