import { Injectable } from '@nestjs/common';
import { TwoFaAuthInterface } from './interface/two-fa-auth.interface';
import { UserPayload } from '../dto/user-payload.dto';
import {
  BaseSendTwoFactorAuthDto,
  SendOtpTwoFactorAuthDto,
} from '../dto/send-otp-two-factor-auth.dto';
import { TwoFaAuthTotpService } from './two-fa-auth-totp.service';

@Injectable()
export class TwoFaAuthStrategy {
  private strategy: TwoFaAuthInterface;

  public setStrategy(strategy: TwoFaAuthInterface) {
    this.strategy = strategy;
  }

  public async enableOtp(user: UserPayload): Promise<BaseSendTwoFactorAuthDto> {
    return await this.strategy.sendOtp(user);
  }

  public async enableVerifyOtp(
    user: UserPayload,
    otp: string,
    hash: string,
  ): Promise<boolean> {
    return await this.strategy.verifyOtp(user, otp, hash);
  }

  public async sendOtp(user: UserPayload): Promise<BaseSendTwoFactorAuthDto> {
    if (this.strategy instanceof TwoFaAuthTotpService) {
      return {
        qrCode: null,
      };
    } else {
      return await this.strategy.sendOtp(user);
    }
  }

  public async verifyOtp(
    user: UserPayload,
    otp: string,
    hash?: string,
  ): Promise<boolean> {
    return await this.strategy.verifyOtp(user, otp, hash);
  }
}
