import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface DeleteVdcDto extends EndpointOptionsInterface {
  urlParams: DeleteVdcUrlParams;
}

interface DeleteVdcUrlParams {
  vdcId: string;
}
