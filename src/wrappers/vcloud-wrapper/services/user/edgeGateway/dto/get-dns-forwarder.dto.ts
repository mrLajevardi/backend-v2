import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetDnsForwarderDto extends EndpointOptionsInterface {
  urlParams: GetDnsForwarderUrlParams;
}

interface GetDnsForwarderUrlParams {
  gatewayId: string;
}
