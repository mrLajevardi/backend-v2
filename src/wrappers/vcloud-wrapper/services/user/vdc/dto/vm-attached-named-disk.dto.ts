import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface VmAttachedNamedDiskDto extends EndpointOptionsInterface {
  urlParams: VmAttachedNamedDiskUrlParams;
}

interface VmAttachedNamedDiskUrlParams {
  namedDiskId: string;
}
