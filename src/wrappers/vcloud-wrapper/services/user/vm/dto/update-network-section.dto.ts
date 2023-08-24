import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface UpdateNetworkSectionDto extends EndpointOptionsInterface {
  urlParams: UpdateNetworkSectionUrlParams;
  body: string;
}

interface UpdateNetworkSectionUrlParams {
  vmId: string;
}
