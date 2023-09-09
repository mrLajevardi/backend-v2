import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetDhcpForwarderDto extends EndpointOptionsInterface {
  urlParams: GetDhcpForwarderUrlParams;
}

interface GetDhcpForwarderUrlParams {
  gatewayId: string;
}
