import { NetworkStatusEnum } from '../enum/network-status.enum';

export interface GetNetworkListDto {
  resultTotal: number;
  pageCount: number;
  page: number;
  pageSize: number;
  associations: null; //unknown
  values: NetworkDetail[];
}
interface NetworkDetail {
  id: string;
  name: string;
  description: string;
  subnets: {
    values: Subnet[];
  };
  backingNetworkId: null | string;
  backingNetworkType: string;
  parentNetworkId: null | string;
  networkType: string;
  orgVdc: {
    name: string;
    id: string;
  };
  ownerRef: {
    name: string;
    id: string;
  };
  orgVdcIsNsxTBacked: null | boolean;
  orgRef: {
    name: string;
    id: string;
  };
  connection: Connection | null;
  isDefaultNetwork: boolean | null;
  shared: boolean;
  enableDualSubnetNetwork: boolean;
  status: NetworkStatusEnum;
  lastTaskFailureMessage: null | string;
  guestVlanTaggingAllowed: boolean;
  retainNicResources: boolean;
  crossVdcNetworkId: null | string;
  crossVdcNetworkLocationId: null | string;
  overlayId: null | string;
  totalIpCount: number;
  usedIpCount: number;
  routeAdvertised: boolean;
  securityGroups: null; // unknown
  segmentProfileTemplateRef: null | string;
}

interface Subnet {
  gateway: string;
  prefixLength: number;
  dnsSuffix: string;
  dnsServer1: string;
  dnsServer2: string;
  ipRanges: {
    values: IpRange[] | null;
  };
  enabled: boolean;
  totalIpCount: number;
  usedIpCount: number;
}

interface IpRange {
  startAddress: string;
  endAddress: string;
}

interface Connection {
  routerRef: {
    name: string;
    id: string;
  };
  connectionType: string;
  connectionTypeValue: string;
  connected: boolean;
}
