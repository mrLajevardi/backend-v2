import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { InvalidPhoneNumberException } from 'src/infrastructure/exceptions/invalid-phone-number.exception';
import { NotificationService } from 'src/application/base/notification/notification.service';
import { OtpService } from '../service/otp.service';
import { AuthService } from '../service/auth.service';
import { OauthService } from '../service/oauth.service';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly oauthService: OauthService,
  ) {
    super();
  }

  // The validation that will be checked before
  // any endpoint protected with jwt-auth guard
  async validate(req): Promise<any> {
    if (!req || !req.body ) {
      throw new ForbiddenException();
    }

    if (!req.body.code) {
      throw new ForbiddenException("no code provided");
    }

    return this.oauthService.verifyLinkedinOauth(req.body.code);

  }
}
