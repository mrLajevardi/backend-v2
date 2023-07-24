import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SmsErrorException } from 'src/infrastructure/exceptions/sms-error-exception';

@Injectable()
export class SmsService {
  async sendSMS(phoneNumber, otp) {
    const otpApiKey = process.env.OTP_API_KEY;
    const url = `https://api.kavenegar.com/v1/${otpApiKey}/verify/lookup.json?receptor=${phoneNumber}&token=${otp}&template=AradOTP`;
    let smsStatus;
    await axios
      .get(url)
      .then((res) => {
        if (res.data.return.status == 200) {
          smsStatus = 'sent';
        }
      })
      .catch((err) => {
        const error = new SmsErrorException();
        return Promise.reject(error);
      });
    return smsStatus;
  }
}
