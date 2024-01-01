import { Injectable } from '@nestjs/common';
import { TwoFaAuthInterface } from './interface/two-fa-auth.interface';
import { NotificationService } from '../../../notification/notification.service';
import { UserTableService } from '../../../crud/user-table/user-table.service';
import { UserPayload } from '../dto/user-payload.dto';
import { OtpErrorException } from '../../../../../infrastructure/exceptions/otp-error-exception';
import { OtpService } from '../../security-tools/otp.service';
import { SendOtpTwoFactorAuthDto } from '../dto/send-otp-two-factor-auth.dto';
import { isNil } from 'lodash';
import { BadRequestException } from '../../../../../infrastructure/exceptions/bad-request.exception';

@Injectable()
export class TwoFaAuthEmailService implements TwoFaAuthInterface {
  constructor(
    private notificationService: NotificationService,
    private userTable: UserTableService,
    private otpService: OtpService,
  ) {}

  async sendOtp(userPayload: UserPayload): Promise<SendOtpTwoFactorAuthDto> {
    const user = await this.userTable.findById(userPayload.userId);

    if (isNil(user.email) || !user.emailVerified) {
      throw new BadRequestException("user don' have verified email ");
    }

    const otpGenerated = this.otpService.otpGenerator(user.email);
    if (!otpGenerated) {
      throw new OtpErrorException();
    }
    const mailContent = this.notificationService.emailContents.twoFactorAuth(
      otpGenerated.otp,
      user.email,
    );
    const mail = await this.notificationService.email.sendMail(mailContent);

    return { hash: otpGenerated.hash };
  }

  async verifyOtp(
    userPayload: UserPayload,
    otp: string,
    hash: string,
  ): Promise<boolean> {
    const user = await this.userTable.findById(userPayload.userId);
    return this.otpService.otpVerifier(user.email, otp, hash);
  }
}
