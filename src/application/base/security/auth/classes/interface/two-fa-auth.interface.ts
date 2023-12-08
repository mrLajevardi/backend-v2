import { Injectable } from '@nestjs/common';
import { UserPayload } from '../../dto/user-payload.dto';
import { SendOtpTwoFactorAuthDto } from '../../dto/send-otp-two-factor-auth.dto';

// @Injectable()
export interface TwoFaAuthInterface {
  sendOtp(user: UserPayload): Promise<SendOtpTwoFactorAuthDto>;

  verifyOtp(user: UserPayload, otp: string, hash: string): Promise<any>;
}
