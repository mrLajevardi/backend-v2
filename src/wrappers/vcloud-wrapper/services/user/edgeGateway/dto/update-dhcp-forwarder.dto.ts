import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface UpdateDhcpForwarderDto extends EndpointOptionsInterface {
  urlParams: UpdateDhcpForwarderUrlParams;
  body: UpdateDhcpForwarderBody;
}

interface UpdateDhcpForwarderUrlParams {
  gatewayId: string;
}

export class UpdateDhcpForwarderBody {
  enabled: boolean;
  dhcpServers: string[];
  version: number;
}
