import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PolicyHandler,
  PolicyHandlerOptions,
} from '../interfaces/policy-handler.interface';
import { CHECK_POLICIES_KEY } from '../decorators/check-policies.decorator';
import { AbilityFactory } from '../ability.factory';
import { PureAbility, subject } from '@casl/ability';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { guardHelper } from 'src/infrastructure/helpers/guard-helper';
import { Action } from '../enum/action.enum';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { AclSubjectsEnum } from '../enum/acl-subjects.enum';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private userTable: UserTableService,
    private reflector: Reflector,
    private caslAbilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.getAllAndOverride<PolicyHandler[]>(CHECK_POLICIES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    const { user } = context.switchToHttp().getRequest();
    // console.dir(policyHandlers, { depth: null });
    // check always valid modes, like public modes or when user is admin
    if (guardHelper.checkValidModes(this.reflector, context, user)) {
      return true;
    }

    if (!user || !user.userId) {
      return false;
    }

    const realUser = await this.userTable.findById(user.userId);

    const ability = await this.caslAbilityFactory.createForUserBeforeHook(
      realUser,
    );
    const request: SessionRequest = context.switchToHttp().getRequest();
    const props: PolicyHandlerOptions = {
      payload: request.body,
      session: request.user,
      params: request.params,
      query: request.query,
    };
    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability, props),
    );
  }

  private execPolicyHandler(
    handler: PolicyHandler,
    ability: PureAbility,
    props: PolicyHandlerOptions,
  ): boolean {
    console.log('exec policy handler');
    // console.log(ability.rules[0].conditions, props);
    if (typeof handler === 'function') {
      const retVal: boolean = handler(ability, props);
      console.log(ability, retVal);
      return retVal;
      //return handler(ability);
    }
    const retVal = handler.handle(ability, props);
    return retVal;
  }
}
