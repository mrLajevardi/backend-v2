import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/ispublic.decorator';
import { guardHelper } from 'src/infrastructure/helpers/guard-helper';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    console.log('can activate');
    // check always valid modes, like public modes or when user is admin
    if (guardHelper.checkValidModes(this.reflector, context)) {
      return true;
    }
    return super.canActivate(context);
  }
}
