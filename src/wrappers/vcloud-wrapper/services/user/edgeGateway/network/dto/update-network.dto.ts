import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';
import { CreateNetworkBody } from './create-network.dto';

export interface UpdateNetworkDto extends EndpointOptionsInterface {
  urlParams: UpdateNetworkUrlParams;
  body: UpdateNetworkBody;
}

interface UpdateNetworkUrlParams {
  networkId: string;
}

export class UpdateNetworkBody extends CreateNetworkBody {}
