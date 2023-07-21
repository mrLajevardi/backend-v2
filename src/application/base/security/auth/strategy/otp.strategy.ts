import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { InvalidPhoneNumberException } from 'src/infrastructure/exceptions/invalid-phone-number.exception';
import { NotificationService } from 'src/application/base/notification/notification.service';
import { OtpService } from '../service/otp.service';
import { AuthService } from '../service/auth.service';

@Injectable()
export class OtpStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly userTable: UserTableService,
    private readonly notificationService: NotificationService,
    private readonly otpService: OtpService,
  ) {
    super();
  }

  // The validation that will be checked before
  // any endpoint protected with jwt-auth guard
  async validate(req): Promise<any> {
    if (!req || !req.body ) {
      throw new ForbiddenException();
    }

    if (!req.body.phoneNumber) {
      throw new InvalidPhoneNumberException();
    }

    const phoneNumber = req.body.phoneNumber;
    const user = await this.userTable.findOne({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    const userExist = user ? true : false;


    if (!req.body.otp) {

      const phoneRegex = new RegExp('^(\\+98|0)?9\\d{9}$');
      if (!phoneRegex.test(phoneNumber)) {
        return Promise.reject(new InvalidPhoneNumberException());
      }

      let hash = null;
      
      if (!userExist) {
        return Promise.reject(new ForbiddenException());
      }
      const otpGenerated = this.otpService.otpGenerator(phoneNumber);
      hash = otpGenerated.hash;
      console.log(otpGenerated);
      await this.notificationService.sms.sendSMS(phoneNumber, otpGenerated.otp);

      return Promise.resolve({ userExist, hash });
    }

    if (!req.body.hash) {
      throw new ForbiddenException('no hash provided');
    }

    const otp = req.body.otp;
    const hash = req.body.hash;

    if (this.otpService.otpVerifier(phoneNumber,otp,hash)){
      return this.authService.login(user);
    }else{
      throw new ForbiddenException();
    }
  }
}
