import { Injectable } from '@nestjs/common';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { InvalidPhoneNumberException } from 'src/infrastructure/exceptions/invalid-phone-number.exception';
import { OtpService } from '../../security-tools/otp.service';
import { AuthService } from '../service/auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-strategy';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { InvalidTokenException } from 'src/infrastructure/exceptions/invalid-token.exception';

@Injectable()
export class OtpStrategy extends PassportStrategy(Strategy, 'otp') {
  constructor(
    private readonly authService: AuthService,
    private readonly userTable: UserTableService,
    private readonly otpService: OtpService,
  ) {
    super();
  }

  async authenticate(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
  ): Promise<void> {
    try {
      if (!req || !req.body) {
        this.error(new ForbiddenException());
        return;
      }

      console.log('otp validator');
      if (!req.body.phoneNumber) {
        this.error(new InvalidPhoneNumberException());
        return;
      }

      const phoneNumber = req.body.phoneNumber;
      const user = await this.userTable.findOne({
        where: {
          phoneNumber: phoneNumber,
        },
      });

      const userExist = user ? true : false;

      if (!userExist || !req.body.otp || !req.body.hash) {
        this.error(new ForbiddenException());
        return;
      }

      const otp = req.body.otp;
      const hash = req.body.hash;
      const verify = this.otpService.otpVerifier(phoneNumber, otp, hash);
      if (verify) {
        const token = await this.authService.login.getLoginToken(user.id);
        this.success(token);
        return;
      } else {
        console.log(otp, hash, phoneNumber);
        this.error(new InvalidTokenException());
      }

      this.error(new ForbiddenException());
    } catch (error) {
      this.error(error);
      console.log(error);
      console.log('error in otp strategy');
    }
  }
}
