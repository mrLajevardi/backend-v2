import { Injectable } from '@nestjs/common';
import { TwoFaAuthInterface } from './interface/two-fa-auth.interface';
import { UserPayload } from '../dto/user-payload.dto';
import { SendOtpTwoFactorAuthDto } from '../dto/send-otp-two-factor-auth.dto';

@Injectable()
export class TwoFaAuthStrategy {
  private strategy: TwoFaAuthInterface;

  public setStrategy(strategy: TwoFaAuthInterface) {
    this.strategy = strategy;
  }

  public async sendOtp(user: UserPayload): Promise<SendOtpTwoFactorAuthDto> {
    return await this.strategy.sendOtp(user);
  }

  public async verifyOtp(
    user: UserPayload,
    otp: string,
    hash: string,
  ): Promise<boolean> {
    return await this.strategy.verifyOtp(user, otp, hash);
  }
}
