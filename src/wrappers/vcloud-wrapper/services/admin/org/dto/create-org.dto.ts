import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface CreateOrgDto extends EndpointOptionsInterface {
  body: CreateOrgBody;
}

interface CreateOrgBody {
  canPublish: boolean;
  diskCount: number;
  isEnabled: boolean;
  catalogCount: number;
  orgVdcCount: number;
  runningVMCount: number;
  userCount: number;
  vappCount: number;
  name: string;
  displayName: string;
}
