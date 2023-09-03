export interface GetIpSetsDto {
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
  ipAddresses: string[];
  members: null; // Define the type if available
  vmCriteria: null; // Define the type if available
}
