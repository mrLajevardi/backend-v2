import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetMediaItemDto extends EndpointOptionsInterface {
  urlParams: GetMediaItemUrlParams;
}

interface GetMediaItemUrlParams {
  mediaItemId: string;
}
