import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';
import { CreateEdgeGatewayBody } from './create-edge-gateway.dto';

export interface UpdateEdgeGatewayDto extends EndpointOptionsInterface {
  body: CreateEdgeGatewayBody;
  urlParams: UpdateEdgeGatewayUrlParams;
}

interface UpdateEdgeGatewayUrlParams {
  edgeId: string;
}
