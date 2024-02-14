import { ZammadRolesEnum } from '../enum/zammad-roles.enum';

export interface CreateUserDto {
  firstname: string;
  lastname: string;
  email: string;
  login: string;
  organization: string;
  roles: ZammadRolesEnum[];
  password: string;
}
