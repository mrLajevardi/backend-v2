import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { InvalidPhoneNumberException } from 'src/infrastructure/exceptions/invalid-phone-number.exception';

@Injectable()
export class CustomStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly userTable: UserTableService,
    private readonly notificationService : Notifications
    ) {
    super();
  }

  // The validation that will be checked before
  // any endpoint protected with jwt-auth guard
  async validate(req): Promise<any> {
    if (! req || !req.body || !req.loginType ) {
      throw new ForbiddenException();
    }

    if (! req.body.phoneNumber){
      throw new InvalidPhoneNumberException();
    }

    const phoneNumber = req.body.phoneNumber; 

    if (!req.body.otp){
      const user = await this.userTable.findOne({
        where: {
          phoneNumber: phoneNumber,
        },
      });
      const phoneRegex = new RegExp('^(\\+98|0)?9\\d{9}$');
  if (!phoneRegex.test(phoneNumber)) {
    return Promise.reject(new InvalidPhoneNumberException());
  }
  let hash = null;
  const userExist = user ? true: false;
    if (! userExist) {
      return Promise.reject(new ForbiddenException());
    }
    const smsService = new SmsService();
    const otpGenerated = otpGenerator(data.phoneNumber);
    await smsService.sendSMS(data.phoneNumber, otpGenerated.otp);
    hash = otpGenerated.hash;
    return Promise.resolve({userExist, hash});

  return Promise.resolve({userExist, hash});


    }

    if (!req.body.hash){
      throw new ForbiddenException('no hash provided');
    }

    const otp = req.body.otp;
    const hash = req.body.hash; 

    return this.authService.validateOtp(phoneNumber,otp,hash);
  }
}
