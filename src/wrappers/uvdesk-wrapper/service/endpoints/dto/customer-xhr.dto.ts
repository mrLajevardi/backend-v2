import { EndpointOptionsInterface } from '../../../../interfaces/endpoint.interface';

export interface CustomerXhrDto extends EndpointOptionsInterface {
  params: CustomerXhrParams;
}

export interface CustomerXhrParams {
  search?: string;
}
