import { SetMetadata } from '@nestjs/common';
import { PredefinedRoles } from '../enum/predefined-enum.type';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: PredefinedRoles[]) => SetMetadata(ROLES_KEY, roles);