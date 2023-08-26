import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetEdgeGatewayDto extends EndpointOptionsInterface {
  params: GetEdgeGatewayParams;
}
interface GetEdgeGatewayParams {
  page: number;
  pageSize: number;
}
