import { VcloudMetadata } from '../type/vcloud-metadata.type';

export interface FoundDatacenterMetadata {
  generation: VcloudMetadata | null;
  datacenter: VcloudMetadata | null;
  datacenterTitle: VcloudMetadata | null;
  cpuSpeed: VcloudMetadata | null;
}
