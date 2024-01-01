import { EndpointOptionsInterface } from 'src/wrappers/interfaces/endpoint.interface';

export interface CreateUserDto extends EndpointOptionsInterface {
  urlParams: CreateUserUrlParams;
  body: CreateUserBody;
}

interface CreateUserUrlParams {
  orgId: string;
}

export class CreateUserBody {
  storedVmQuota: number;
  deployedVmQuot: number;
  isEnabled: boolean;
  name: string;
  password: string;
  role: Role;
  fullName: string | null;
  emailAddress: null | string;
  telephone: string | null;
  im: null | string;
}

class Role {
  vCloudExtension: null;
  href: string;
  type: string;
  link: string;
}
