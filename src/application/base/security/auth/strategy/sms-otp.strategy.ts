// Step 7: Create a custom Passport strategy
// sms-otp.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';
import { ExtractJwt } from 'passport-jwt';
import { SmsService } from 'src/application/base/notification/sms.service';
import { OtpService } from '../service/otp.service';

@Injectable()
export class SmsOtpStrategy extends PassportStrategy(Strategy, 'sms-otp') {
  constructor(
    private readonly smsService: SmsService,
    private readonly otpService: OtpService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          const phoneNumber = request.body.phoneNumber; 
          return this.otpService.otpGenerator(phoneNumber);
         // return phoneNumber && this.smsOtpService.getOtp(phoneNumber);
        },
      ]),
      passReqToCallback: true,
    });
  }

  async validate(phoneNumber: any, otp: string, hash: string): Promise<any> {
    if (this.otpService.otpVerifier(phoneNumber,otp,hash)) {
      return { phoneNumber };
    } else {
      throw new Error('Invalid OTP');
    }
  }
}
