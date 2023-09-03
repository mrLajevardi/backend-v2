export interface GetExternalNetworksDto {
  resultTotal: number;
  pageCount: number;
  page: number;
  pageSize: number;
  associations: null;
  values: GetExternalNetworksDtoValue[];
}

export interface GetExternalNetworksDtoValue {
  id: string;
  name: string;
  description: string;
  subnets: Subnets | null;
  status: string;
  networkBackings: NetworkBackings;
  totalIpCount: number | null;
  usedIpCount: number | null;
  dedicatedOrg: null;
  dedicatedEdgeGateway: null;
  usingIpSpace: boolean;
}

export interface NetworkBackings {
  values: NetworkBackingsValue[];
}

export interface NetworkBackingsValue {
  backingId: string;
  backingType: string;
  backingTypeValue: string;
  networkProvider: NetworkProvider;
  name: string;
  isNsxTVlanSegment: boolean;
  parentTier0Ref: null;
}

export interface NetworkProvider {
  name: string;
  id: string;
}

export interface Subnets {
  values: SubnetsValue[];
}

export interface SubnetsValue {
  gateway: string;
  prefixLength: number;
  dnsSuffix: null;
  dnsServer1: string;
  dnsServer2: string;
  ipRanges: IPRanges;
  enabled: boolean;
  totalIpCount: number;
  usedIpCount: number;
}

export interface IPRanges {
  values: IPRangesValue[];
}

export interface IPRangesValue {
  startAddress: string;
  endAddress: string;
}
