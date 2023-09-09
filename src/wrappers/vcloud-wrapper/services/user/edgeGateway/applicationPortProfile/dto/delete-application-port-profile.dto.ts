import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface DeleteApplicationPortProfilesDto
  extends EndpointOptionsInterface {
  urlParams: DeleteApplicationPortProfilesUrlParams;
}

interface DeleteApplicationPortProfilesUrlParams {
  applicationId: string;
}
