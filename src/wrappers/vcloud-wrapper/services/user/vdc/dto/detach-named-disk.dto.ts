import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface DetachNamedDiskOptionsDto extends EndpointOptionsInterface {
  urlParams: DetachNamedDiskUrlParams;
  body: DetachNamedDiskBody;
}

export interface DetachNamedDiskUrlParams {
  vmId: string;
}

export interface DetachNamedDiskBody {
  disk: Disk;
}

interface Disk {
  href: string;
  type: string;
}
