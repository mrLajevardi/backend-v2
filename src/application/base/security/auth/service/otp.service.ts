import { Injectable } from "@nestjs/common";
import * as otpGen from "otp-generator";
import * as otpTool from "otp-without-db";

@Injectable()
export class OtpService {
  otpGenerator(phoneNumber) {
    const otp = otpGen.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const key = process.env.OTP_SECRET_KEY;
    console.log("creating otp from", phoneNumber, otp, key);
    const hash = otpTool.createNewOTP(phoneNumber, otp, key);
    return { otp, hash };
  }

  otpVerifier(phoneNumber, otp, hash) {
    const key = process.env.OTP_SECRET_KEY;
    const verify = otpTool.verifyOTP(phoneNumber, otp, hash, key);
    return verify;
  }
}
