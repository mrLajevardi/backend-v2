import { Injectable } from '@nestjs/common';
import { TwoFaAuthInterface } from './interface/two-fa-auth.interface';
import { UserPayload } from '../dto/user-payload.dto';
import { NotificationService } from '../../../notification/notification.service';
import { UserTableService } from '../../../crud/user-table/user-table.service';
import { OtpService } from '../../security-tools/otp.service';
import { OtpErrorException } from '../../../../../infrastructure/exceptions/otp-error-exception';

@Injectable()
export class TwoFaAuthSmsService implements TwoFaAuthInterface {
  constructor(
    private notificationService: NotificationService,
    private userTable: UserTableService,
    private otpService: OtpService,
  ) {}

  async sendOtp(userPayload: UserPayload): Promise<any> {
    const user = await this.userTable.findById(userPayload.userId);
    const otpGenerated = this.otpService.otpGenerator(user.phoneNumber);
    if (!otpGenerated) {
      throw new OtpErrorException();
    }
    const sendSms = await this.notificationService.sms.sendSMS(
      user.phoneNumber,
      otpGenerated.otp,
    );

    return { otp: otpGenerated.otp, hash: otpGenerated.hash };
  }

  async verifyOtp(
    userPayload: UserPayload,
    otp: string,
    hash: string,
  ): Promise<any> {
    const user = await this.userTable.findById(userPayload.userId);
    return this.otpService.otpVerifier(user.phoneNumber, otp, hash);
  }
}
