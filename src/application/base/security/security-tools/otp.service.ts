import { Injectable } from '@nestjs/common';
import * as otpGen from 'otp-generator';
import * as otpTool from 'otp-without-db';
import { OtpHashDto } from './dto/otp-hash.dto';

@Injectable()
export class OtpService {
  otpGenerator(phoneNumber: string): OtpHashDto {
    const otp = otpGen.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const key = process.env.OTP_SECRET_KEY;

    const hash = otpTool.createNewOTP(phoneNumber, otp, key);
    return { otp: otp, hash };
  }

  otpVerifier(phoneNumber: string, otp: string, hash: string): boolean {
    const key = process.env.OTP_SECRET_KEY;
    const verify = otpTool.verifyOTP(phoneNumber, otp, hash, key);
    return verify;
  }
}
