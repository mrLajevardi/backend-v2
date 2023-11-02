import { Reference } from './create-vdc.dto';

export class UpdateVdcComputePolicyDto {
  cores: number;
  name: string;
  allocationModel: AllocationModel;
  ram: number;
  providerVdcReference: Reference;
  vm: number;
  nicQuota: number;
  networkQuota: number;
  authToken: string;
  resourceGuaranteedCpu: number;
  resourceGuaranteedMemory: number;
}
export enum AllocationModel {
  FLEX = 'Flex',
}
