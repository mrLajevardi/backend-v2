import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface UpdateVdcDto extends EndpointOptionsInterface {
  urlParams: UpdateVdcUrlParams;
  body: UpdateVdcBody;
}

interface UpdateVdcUrlParams {
  vdcId: string;
}

export class UpdateVdcBody {
  type: string;
  id: string;
  name: string;
  allocationModel: string;
  computeCapacity: ComputeCapacity;
  providerVdcReference: ProviderVdcReference;
  vmQuota: number;
  nicQuota: number;
  networkQuota: number;
}

class ProviderVdcReference {
  href: string;
  name?: string;
}
class ComputeCapacity {
  cpu: ComputeResource;
  memory: ComputeResource;
}

class ComputeResource {
  allocated: number;
  limit: number;
}
