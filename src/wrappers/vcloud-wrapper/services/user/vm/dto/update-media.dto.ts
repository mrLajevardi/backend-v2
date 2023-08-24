import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface UpdateMediaDto extends EndpointOptionsInterface {
  urlParams: UpdateMediaUrlParams;
  body: UpdateMediaBody;
}

interface UpdateMediaUrlParams {
  mediaId: string;
}

export class UpdateMediaBody {
  name: string;
}
