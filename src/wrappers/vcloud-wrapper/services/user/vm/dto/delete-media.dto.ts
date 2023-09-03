import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface DeleteMediaDto extends EndpointOptionsInterface {
  urlParams: DeleteMediaUrlParams;
}

export interface DeleteMediaUrlParams {
  mediaId: string;
}
