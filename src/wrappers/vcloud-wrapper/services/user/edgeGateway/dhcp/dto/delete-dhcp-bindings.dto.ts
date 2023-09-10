import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface DeleteDhcpBindingDto extends EndpointOptionsInterface {
  urlParams: DeleteDhcpBindingUrlParams;
}

interface DeleteDhcpBindingUrlParams {
  networkId: string;
  bindingId: string;
}
