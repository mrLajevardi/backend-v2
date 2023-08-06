import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PredefinedRoles } from "../enum/predefined-enum.type";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { AbilityAdminService } from "../service/ability-admin.service";
import { IS_PUBLIC_KEY } from "../../auth/decorators/ispublic.decorator";
import { guardHelper } from "src/infrastructure/helpers/guard-helper";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly abilityAdminService: AbilityAdminService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<PredefinedRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // check always valid modes, like public modes or when user is admin 
    if (guardHelper.checkValidModes(this.reflector,context,user)){
        return true;
    }

    const userRoles = await this.abilityAdminService.getAllPredefinedRoles(
      user.userId
    );
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
