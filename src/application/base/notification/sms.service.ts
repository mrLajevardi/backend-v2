import { Injectable } from "@nestjs/common";
import axios from "axios";
import { SmsErrorException } from "src/infrastructure/exceptions/sms-error-exception";

@Injectable()
export class SmsService {
  constructor() {}

  async sendSMS(phoneNumber, otp) {
    const url = `https://api.kavenegar.com/v1/${otpConfig.apiKey}/verify/lookup.json?receptor=${phoneNumber}&token=${otp}&template=AradOTP`;
    let smsStatus;
    await axios
      .get(url)
      .then((res) => {
        if (res.data.return.status == 200) {
          smsStatus = "sent";
        }
      })
      .catch((err) => {
        const error = new SmsErrorException();
        return Promise.reject(error);
      });
    return smsStatus;
  }
}
