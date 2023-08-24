import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface RemoveNamedDiskDto extends EndpointOptionsInterface {
  urlParams: RemoveNamedDiskUrlParams;
}

interface RemoveNamedDiskUrlParams {
  namedDiskId: string;
}
