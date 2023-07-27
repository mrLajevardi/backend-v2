import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SmsErrorException } from 'src/infrastructure/exceptions/sms-error-exception';

@Injectable()
export class SmsService {
  async sendSMS(phoneNumber: string, otp: string) {
    const otpApiKey = process.env.OTP_API_KEY;
    const otpSecret = process.env.OTP_SECRET_KEY;
    const url = `https://api.kavenegar.com/v1/${otpSecret}/verify/lookup.json`;

    console.log(url, otp, phoneNumber);
    let smsStatus;
    try {
      const res = await axios.get(url, {
        params: {
          receptor: phoneNumber,
          token: otp,
          template: 'AradOTP',
        },
      });

      if (res.data.return.status == 200) {
        smsStatus = 'sent';
      }
    } catch (err) {
      const error = new SmsErrorException(err.message);
      return Promise.reject(err);
    }
    return smsStatus;
  }
}
