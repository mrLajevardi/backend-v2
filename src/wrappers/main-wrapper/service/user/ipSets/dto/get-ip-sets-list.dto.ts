interface FirewallGroup {
  orgRef: {
    name: string;
    id: string;
  };
  edgeGatewayRef: {
    name: string;
    id: string;
  };
  ownerRef: {
    name: string;
    id: string;
  };
  networkProviderScope: null; // Define the type if available
  status: string;
  id: string;
  name: string;
  description: string;
  type: string;
  typeValue: string;
}

export interface GetIpSetsListDto {
  resultTotal: number;
  pageCount: number;
  page: number;
  pageSize: number;
  associations: null; // Define the type if available
  values: FirewallGroup[];
}
