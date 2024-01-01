import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface UpdateApplicationPortProfilesDto
  extends EndpointOptionsInterface {
  body: UpdateApplicationPortProfilesBody;
  urlParams: UpdateApplicationPortProfilesUrlParams;
}

export class UpdateApplicationPortProfilesBody {
  name: string;
  description: string;
  applicationPorts: ApplicationPorts[];
  orgRef: OrgRef;
  contextEntityId: string;
  scope: string;
}

class OrgRef {
  id: string;
}

export class ApplicationPorts {
  protocol: string;
  destinationPorts: number[];
}

interface UpdateApplicationPortProfilesUrlParams {
  applicationId: string;
}
