import { Reference } from './create-vdc.dto';

export class UpdateVdcStoragePolicyDto {
  authToken: string;
  name: string;
  default: boolean;
  units: string;
  storage: number;
  enabled: boolean;
  providerVdcStorageProfile: Reference;
}
