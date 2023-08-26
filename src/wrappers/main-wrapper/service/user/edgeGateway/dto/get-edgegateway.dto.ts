interface SubnetIpRange {
  startAddress: string;
  endAddress: string;
}

interface Subnet {
  gateway: string;
  prefixLength: number;
  dnsSuffix: null | string;
  dnsServer1: string;
  dnsServer2: string;
  ipRanges: { values: SubnetIpRange[] };
  enabled: boolean;
  totalIpCount: number;
  usedIpCount: null | number;
  primaryIp: string;
  autoAllocateIpRanges: boolean;
}

interface Uplink {
  uplinkId: string;
  uplinkName: string;
  subnets: { values: Subnet[] };
  connected: boolean;
  quickAddAllocatedIpCount: null | number;
  dedicated: boolean;
  usingIpSpace: boolean;
  vrfLiteBacked: boolean;
  backingType: string;
}

interface EdgeGateway {
  status: string;
  id: string;
  name: string;
  description: string;
  edgeGatewayUplinks: Uplink[];
  distributedRoutingEnabled: boolean;
  nonDistributedRoutingEnabled: boolean;
  orgVdcNetworkCount: number;
  gatewayBacking: {
    backingId: null | string;
    gatewayType: string;
    networkProvider: null;
  };
  orgVdc: {
    name: string;
    id: string;
  };
  ownerRef: {
    name: string;
    id: string;
  };
  orgRef: {
    name: string;
    id: string;
  };
  serviceNetworkDefinition: string;
  distributedRouterUplinkNetworkDefinition: null | string;
  edgeClusterConfig: {
    primaryEdgeCluster: {
      edgeClusterRef: {
        name: string;
        id: string;
      };
      backingId: string;
    };
    secondaryEdgeCluster: null | any; // Define the type if available
  };
}

export interface GetEdgeGatewayDto {
  resultTotal: number;
  pageCount: number;
  page: number;
  pageSize: number;
  associations: null;
  values: EdgeGateway[];
}
