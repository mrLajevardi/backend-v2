import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PolicyHandler } from "../interfaces/policy-handler.interface";
import { CHECK_POLICIES_KEY } from "../decorators/check-policies.decorator";
import { AbilityFactory, Action } from "../ability.factory";
import { Acl } from "src/infrastructure/database/entities/Acl";
import { UserService } from "../../user/user.service";
import { PureAbility } from "@casl/ability";

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private reflector: Reflector,
    private caslAbilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const { user } = context.switchToHttp().getRequest();
    const realUser = await this.userService.findById(user.userId); 

    const ability = await this.caslAbilityFactory.createForUser(realUser);
    
    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: PureAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}