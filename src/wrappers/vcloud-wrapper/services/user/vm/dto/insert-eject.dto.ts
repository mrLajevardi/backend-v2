import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface InsertOrEjectDto extends EndpointOptionsInterface {
  urlParams: InsertOrEjectUrlParams;
  body: string;
}

interface InsertOrEjectUrlParams {
  vmId: string;
  action: string;
}
