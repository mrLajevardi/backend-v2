import { Injectable } from '@nestjs/common';
import { UserPayload } from '../../dto/user-payload.dto';
import {
  BaseSendTwoFactorAuthDto,
  SendOtpTwoFactorAuthDto,
} from '../../dto/send-otp-two-factor-auth.dto';

// @Injectable()
export interface TwoFaAuthInterface {
  sendOtp(user: UserPayload): Promise<BaseSendTwoFactorAuthDto>;

  verifyOtp(user: UserPayload, otp: string, hash?: string): Promise<boolean>;
}
