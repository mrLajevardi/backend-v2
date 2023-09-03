import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface EnableVdcDto extends EndpointOptionsInterface {
  urlParams: EnableVdcUrlParams;
}

interface EnableVdcUrlParams {
  vdcId: string;
}
