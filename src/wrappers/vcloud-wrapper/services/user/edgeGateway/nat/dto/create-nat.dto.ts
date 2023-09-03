import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface CreateNatDto extends EndpointOptionsInterface {
  urlParams: CreateNatUrlParams;
  body: CreateNatBody;
}

interface CreateNatUrlParams {
  gatewayId: string;
}

export class CreateNatBody {
  enabled: boolean;
  dnatExternalPort: object;
  externalAddresses: string;
  internalAddresses: string;
  internalPort: number | null;
  name: string;
  snatDestinationAddresses: string | null;
  applicationPortProfile: ApplicationPortProfile | null;
  type: string;
  logging: boolean;
  priority: number;
  description: string | null;
  firewallMatch: string;
}

class ApplicationPortProfile {
  id: string;
  name: string;
}
