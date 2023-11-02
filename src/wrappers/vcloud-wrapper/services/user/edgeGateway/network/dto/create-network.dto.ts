import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface CreateNetworkDto extends EndpointOptionsInterface {
  body: CreateNetworkBody;
}
export class CreateNetworkBody {
  description: string;
  name: string;
  networkType: string;
  subnets: Subnets;
  connection: Connection;
  ownerRef: OwnerRef;
}

export class Connection {
  connectionType: string;
  connectionTypeValue: string;
}
export class OwnerRef {
  id: string;
}

export class Subnets {
  values: SubnetsValues[];
}
export class SubnetsValues {
  dnsServer1: string;
  dnsServer2: string;
  dnsSuffix: string;
  enabled: boolean;
  gateway: string;
}

export class IpRanges {
  values: IpRangesValues[];
}

export class IpRangesValues {
  startAddress: string;
  endAddress: string;
}
