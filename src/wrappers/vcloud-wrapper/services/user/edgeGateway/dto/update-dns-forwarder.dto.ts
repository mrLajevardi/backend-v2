import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface UpdateDnsForwarderDto extends EndpointOptionsInterface {
  urlParams: UpdateDnsForwarderUrlParams;
  body: UpdateDnsForwarderBody;
}

interface UpdateDnsForwarderUrlParams {
  gatewayId: string;
}

export class UpdateDnsForwarderBody {
  enabled: boolean;
  listenerIp: string | null;
  defaultForwarderZone: DefaultForwarderZone;
  conditionalForwarderZones: null;
  version: null;
  snatRuleEnabled: null;
}

class DefaultForwarderZone {
  displayName: string;
  upstreamServers: string[];
}
