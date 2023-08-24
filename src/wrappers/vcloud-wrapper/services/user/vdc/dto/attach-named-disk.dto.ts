import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface AttachNamedDiskOptionsDto extends EndpointOptionsInterface {
  urlParams: AttachNamedDiskUrlParams;
  body: AttachNamedDiskBody;
}

export interface AttachNamedDiskUrlParams {
  vmId: string;
}

export interface AttachNamedDiskBody {
  disk: Disk;
}

interface Disk {
  href: string;
  type: string;
  vCloudExtension: void[];
}
