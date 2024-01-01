import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface PartialUploadDto extends EndpointOptionsInterface {
  urlParams: PartialUploadUrlParams;
  body: SessionRequest;
}

interface PartialUploadUrlParams {
  fullAddress: string;
}
