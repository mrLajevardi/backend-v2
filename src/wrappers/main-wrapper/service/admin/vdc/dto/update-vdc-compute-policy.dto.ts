import { Reference } from './create-vdc.dto';

export class UpdateVdcComputePolicyDto {
  cores: number;
  name: string;
  allocationModel: AllocationModel;
  ComputeCapacity: Capacity;
  ram: number;
  providerVdcReference: Reference;
  vm: number;
  nicQuota: number;
  networkQuota: number;
  authToken: string;
}

class Capacity {
  unit: string;
  limit: number;
  allocated: number;
}
export enum AllocationModel {
  FLEX = 'Flex',
}
