import { ExecutionContext, Injectable, mixin } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { OtpStrategy } from '../strategy/otp.strategy';

@Injectable()
export class OtpAuthGuard extends AuthGuard('otp') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    console.log('can activate in otp auth guard');
    return super.canActivate(context);
  }
}
