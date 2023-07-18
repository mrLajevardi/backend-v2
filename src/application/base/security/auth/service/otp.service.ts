import { Injectable } from '@nestjs/common';
import { otpGenerator } from 'otp-generator';
import { otpTool } from 'otp-without-db';
import otp

@Injectable()
export class OtpService {
    otpGenerator(phoneNumber){
        const otp = otpGen.generate(6, {
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });
      
        const hash = otpTool.createNewOTP(phoneNumber, otp, key);
        return {otp, hash};
      };
      
      otpVerifier(phoneNumber, otp, hash){
        const verify = otpTool.verifyOTP(phoneNumber, otp, hash, key);
        return verify;
      };
      

}
