import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface UpdateNetworkSectionDto extends EndpointOptionsInterface {
  urlParams: UpdateNetworkSectionUrlParams;
  body: UpdateNetworkSectionBody;
}

interface UpdateNetworkSectionUrlParams {
  vmId: string;
}

export class UpdateNetworkSectionBody {
  _type: string;
  primaryNetworkConnectionIndex: number;
  networkConnection: NetworkConnection[];
}

class NetworkConnection {
  ipType: string;
  secondaryIpAddress: string | null;
  secondaryIpType: string | null;
  externalIpAddress: string | null;
  secondaryIpAddressAllocationMode: string | null;
}
