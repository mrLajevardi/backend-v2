import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/ispublic.decorator';
import { IS_ROBOT_KEY } from '../decorators/is-robot.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    console.log('can activate');
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isRobot = this.reflector.getAllAndOverride<boolean>(IS_ROBOT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isRobot) {
      return true;
    }

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
