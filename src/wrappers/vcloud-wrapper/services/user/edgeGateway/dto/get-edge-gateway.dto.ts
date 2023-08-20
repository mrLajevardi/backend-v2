import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetEdgeGatewayDto extends EndpointOptionsInterface {
  urlParams: GetEdgeGatewayUrlParams;
  params: GetEdgeGatewayParams;
}

interface GetEdgeGatewayUrlParams {
  gatewayId: string;
}

interface GetEdgeGatewayParams {
  page: number;
  pageSize: number;
}
