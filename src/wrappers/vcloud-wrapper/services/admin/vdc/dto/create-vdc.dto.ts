import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';
import { VdcStorageProfileParams } from 'src/wrappers/main-wrapper/service/admin/vdc/dto/create-vdc.dto';

export interface CreateVdcDto extends EndpointOptionsInterface {
  urlParams: CreateVdcUrlParams;
  body: CreateVdcBody;
}

interface CreateVdcUrlParams {
  orgId: string;
}

export class CreateVdcBody {
  name: string;
  description: null | string;
  isEnabled: boolean;
  allocationModel: string;
  computeCapacity: ComputeCapacity;
  includeMemoryOverhead: boolean;
  isElastic: boolean;
  vCpuInMhz: number;
  resourceGuaranteedCpu: number;
  resourceGuaranteedMemory: number;
  providerVdcReference: ProviderVdcReference;
  vmQuota: number;
  networkPoolReference: NetworkPoolReference;
  networkQuota: number;
  vdcStorageProfile: VdcStorageProfileParams[];
  isThinProvision: boolean;
  usesFastProvisioning: boolean;
}

class ComputeCapacity {
  cpu: ComputeResource;
  memory: ComputeResource;
}

class ComputeResource {
  allocated: number;
  limit: number;
}

class ProviderVdcReference {
  href: string;
  name: string;
}

class NetworkPoolReference {
  name: string;
  href: string;
}
