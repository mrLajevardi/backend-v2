import { EndpointOptionsInterface } from '../../../../interfaces/endpoint.interface';

export interface UpdateCustomerProfileDto extends EndpointOptionsInterface {
  body: any;
  urlParams: UpdateCustomerProfileUrlParams;
}

export interface UpdateCustomerProfileUrlParams {
  customerId: number;
}
