import { VcloudTask } from 'src/infrastructure/dto/vcloud-task.dto';

export class CreateVdcConfig {
  name: string;
  isEnabled: boolean;
  cores: number;
  vCpuInMhz: number;
  ram: number;
  authToken: string;
  providerVdcReference: Reference;
  resourceGuaranteedCpu: number;
  resourceGuaranteedMemory: number;
  networkPoolReference: Reference;
  vm: number;
  networkQuota: number;
  storage: number;
  vdcStorageProfileParams: VdcStorageProfileParams;
}
export class Reference {
  href: string;
  name: string;
}

class VdcStorageProfileParams {
  default: boolean;
  _default: boolean;
  enabled: boolean;
  units: string;
  providerVdcStorageProfile: Reference;
}
export class CreateVdcDto extends VcloudTask {
  id: string;
}
