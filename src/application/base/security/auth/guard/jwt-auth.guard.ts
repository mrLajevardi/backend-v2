import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { guardHelper } from 'src/infrastructure/helpers/guard-helper';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('can activate');
    // check always valid modes, like public modes or when user is admin
    if (guardHelper.checkValidModes(this.reflector, context)) {
      return true;
    }
    return super.canActivate(context);
  }
}
