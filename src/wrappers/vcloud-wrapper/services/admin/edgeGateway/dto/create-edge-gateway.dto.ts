import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface CreateEdgeGatewayDto extends EndpointOptionsInterface {
  body: CreateEdgeGatewayBody;
}

export class CreateEdgeGatewayBody {
  name: string;
  description: string;
  ownerRef: OwnerRef;
  edgeGatewayUplinks: EdgeGatewayUplinks[];
}

class OwnerRef {
  id: string;
}

class EdgeGatewayUplinks {
  uplinkId: string;
  uplinkName: string;
  subnets: Subnets;
  dedicated: boolean;
}

class Subnets {
  values: SubnetsValues[];
}
class SubnetsValues {
  gateway: string;
  prefixLength: number;
  dnsSuffix: string | null;
  dnsServer1: string;
  dnsServer2: string;
  ipRanges: IpRange;
  enabled: boolean;
  totalIpCount: number;
  usedIpCount: number;
}

class IpRange {
  values: IpRangeValues[];
}
class IpRangeValues {
  startAddress: string;
  endAddress: string;
}
