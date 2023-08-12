import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { PredefinedRoles } from '../enum/predefined-enum.type';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: PredefinedRoles[]): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, roles);
