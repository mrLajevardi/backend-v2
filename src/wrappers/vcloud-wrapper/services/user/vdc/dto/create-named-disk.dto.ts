import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface CreateNamedDiskOptionsDto extends EndpointOptionsInterface {
  urlParams: CreateNamedDiskUrlParams;
  body: string;
}

export interface CreateNamedDiskUrlParams {
  vdcId: string;
}

export interface CreateNamedDiskBody {
  'root:DiskCreateParams': DiskCreateParams;
}

interface DiskCreateParams {
  $: DiskCreateParamsMetadata;
  'root:Disk': Disk;
}
interface DiskCreateParamsMetadata {
  'xmlns:root': string;
}

interface Disk {
  $: DiskMetadata;
  'root:Description': string;
  'root:StorageProfile': StorageProfile;
}

interface DiskMetadata {
  name: string;
  busType: number;
  busSubType: string;
  sizeMb: number;
  sharingType: string;
}
interface StorageProfile {
  $: StorageProfileMetadata;
}

interface StorageProfileMetadata {
  href: string;
  type: string;
}
