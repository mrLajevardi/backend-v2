import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';
import { Stream } from 'stream';

export interface PartialUploadDto extends EndpointOptionsInterface {
  urlParams: PartialUploadUrlParams;
  body: Stream;
}

interface PartialUploadUrlParams {
  fullAddress: string;
}
