import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface UpdateVdcStorageProfileDto extends EndpointOptionsInterface {
  urlParams: UpdateVdcStorageProfileUrlParams;
  body: UpdateVdcStorageProfileBody;
}

interface UpdateVdcStorageProfileUrlParams {
  fullUrl: string;
}

export class UpdateVdcStorageProfileBody {
  name: string;
  default: boolean;
  units: string;
  limit: number;
  enabled: boolean;
  providerVdcStorageProfile: ProviderVdcStorageProfile;
}

class ProviderVdcStorageProfile {
  name?: string;
  href: string;
}
