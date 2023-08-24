import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface UploadFileDto extends EndpointOptionsInterface {
  urlParams: UploadFileUrlParams;
  body: UploadFileBody;
}

interface UploadFileUrlParams {
  catalogId: string;
}

export class UploadFileBody {
  imageType: string;
  name: string;
  size: number;
}
