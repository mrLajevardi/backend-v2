import { EndpointOptionsInterface } from '../../../../../interfaces/endpoint.interface';
import { ZammadRoles } from '../enum/roles.enum';

export interface CreateZammadUserInterface extends EndpointOptionsInterface {
  body: CreateZammadUserBodyInterface;
}

interface CreateZammadUserBodyInterface {
  firstname: string;
  lastname: string;
  email: string;
  login: string;
  organization: string;
  password: string;
  roles: ZammadRoles[];
  group_ids: GroupIds;
  organization_id: string;
  role_ids: string[];
}

interface GroupIds {
  [key: number]: string[];
}
