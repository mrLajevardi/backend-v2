export interface GetIpUsageNetworkDto {
  resultTotal: number;
  pageCount: number;
  page: number;
  pageSize: number;
  associations: null;
  values: EdgeGatewayDetail[];
}

interface EdgeGatewayDetail {
  vappName: null | string;
  id: string;
  entityId: null | string;
  entityName: string;
  vAppName: null;
  ipAddress: string;
  deployed: boolean;
  allocationType: string;
  networkRef: {
    name: string;
    id: string;
  };
  orgRef: {
    name: string;
    id: string;
  };
}
