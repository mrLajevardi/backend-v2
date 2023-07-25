import { Injectable, Logger } from '@nestjs/common';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { InvalidPhoneNumberException } from 'src/infrastructure/exceptions/invalid-phone-number.exception';
import { NotificationService } from 'src/application/base/notification/notification.service';
import { OtpService } from '../../security-tools/otp.service';
import { AuthService } from '../service/auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-strategy';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { SmsErrorException } from 'src/infrastructure/exceptions/sms-error-exception';
import { generatePassword } from 'src/infrastructure/helpers/helpers';
import { User } from 'src/infrastructure/database/entities/User';
import { UserService } from 'src/application/base/user/service/user.service';

@Injectable()
export class OtpStrategy extends PassportStrategy(Strategy, 'otp') {
  constructor(
    private readonly authService: AuthService,
    private readonly userTable: UserTableService,
    private readonly notificationService: NotificationService,
    private readonly otpService: OtpService,
    private readonly userService: UserService
  ) {
    super();
  }

  async authenticate(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    options?: any,
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

      console.log('user exists', userExist);
      if (!req.body.otp) {
        const phoneRegex = new RegExp('^(\\+98|0)?9\\d{9}$');
        if (!phoneRegex.test(phoneNumber)) {
          this.error(new InvalidPhoneNumberException());
          return;
        }

        let hash = null;

        const otpGenerated = this.otpService.otpGenerator(phoneNumber);
        hash = otpGenerated.hash;
        console.log(otpGenerated);
        try {
          await this.notificationService.sms.sendSMS(
            phoneNumber,
            otpGenerated.otp,
          );
        } catch (error) {
          this.error(error);
        }
        return;
      }

      if (!req.body.hash) {
        this.error(new ForbiddenException('no hash provided'));
      }

      const otp = req.body.otp;
      const hash = req.body.hash;

      console.log('validating ', otp, hash);
      if (this.otpService.otpVerifier(phoneNumber, otp, hash)) {
        let theUser : User;
        if (!userExist) {
          theUser = await this.userService.createUserByPhoneNumber(phoneNumber);
        }else{
          theUser = user;
        }
        const token = this.authService.login.getLoginToken(theUser);
        this.success(token);
        return;
      } else {
        this.error(new ForbiddenException());
      } 
    } catch (error) {
      this.error(error);
    }
  }
}
