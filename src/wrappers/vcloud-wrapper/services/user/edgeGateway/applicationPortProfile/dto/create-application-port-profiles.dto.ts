import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface CreateApplicationPortProfilesDto
  extends EndpointOptionsInterface {
  body: CreateApplicationPortProfilesBody;
}

export class CreateApplicationPortProfilesBody {
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
