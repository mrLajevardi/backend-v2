import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PolicyHandler } from '../interfaces/policy-handler.interface';
import { CHECK_POLICIES_KEY } from '../decorators/check-policies.decorator';
import { AbilityFactory } from '../ability.factory';
import { UserService } from '../../../user/service/user.service';
import { PureAbility } from '@casl/ability';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { guardHelper } from 'src/infrastructure/helpers/guard-helper';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private userTable: UserTableService,
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

    // check always valid modes, like public modes or when user is admin
    if (guardHelper.checkValidModes(this.reflector, context, user)) {
      return true;
    }

    if (!user || !user.userId) {
      return false;
    }

    const realUser = await this.userTable.findById(user.userId);

    const ability = await this.caslAbilityFactory.createForUser(realUser);

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: PureAbility) {
    console.log('exec policy handler');
    if (typeof handler === 'function') {
      const retVal = handler(ability);
      //console.log(retVal);
      return retVal;
      //return handler(ability);
    }
    const retVal = handler.handle(ability);
    console.log(retVal);
    return retVal;
  }
}
