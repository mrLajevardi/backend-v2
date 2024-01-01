import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface GetApplicationPortProfilesDto
  extends EndpointOptionsInterface {
  urlParams: GetApplicationPortProfilesUrlParams;
}

interface GetApplicationPortProfilesUrlParams {
  applicationId: string;
}
