import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { PersonalUnverifiedException } from '../../../../../infrastructure/exceptions/personal-unverified.exception';

@Injectable()
export class PersonalVerificationGuard extends AuthGuard(
  'PersonalCodeVerification',
) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | any {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user.personalVerification) {
      throw new PersonalUnverifiedException();
    }

    return true;
  }
}
