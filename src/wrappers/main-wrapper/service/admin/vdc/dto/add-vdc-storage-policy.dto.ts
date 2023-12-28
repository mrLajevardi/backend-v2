import { Reference } from './create-vdc.dto';

export class AddVdcStoragePolicyDto {
  name: string;
  default: boolean;
  units: string;
  limit: number;
  enabled: boolean;
  providerVdcStorageProfile: Reference;
}
