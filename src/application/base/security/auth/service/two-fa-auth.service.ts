import { Injectable } from '@nestjs/common';
import { UserPayload } from '../dto/user-payload.dto';
import { TwoFaAuthTypeService } from '../classes/two-fa-auth-type.service';
import { TwoFaAuthTypeEnum } from '../enum/two-fa-auth-type.enum';
import { TwoFaAuthStrategy } from '../classes/two-fa-auth.strategy';
import { SendOtpTwoFactorAuthDto } from '../dto/send-otp-two-factor-auth.dto';
import { UserTableService } from '../../../crud/user-table/user-table.service';

@Injectable()
export class TwoFaAuthService {
  constructor(
    private TwoFaAuthType: TwoFaAuthTypeService,
    private TwoFaAuthStrategy: TwoFaAuthStrategy,
    private readonly userTable: UserTableService,
  ) {}

  private dictionary = {
    1: this.TwoFaAuthType.sms,
    2: this.TwoFaAuthType.email,
  };

  private convertType = {
    sms: 1,
    email: 2,
  };
  public async enable(
    user: UserPayload,
    type: string,
  ): Promise<SendOtpTwoFactorAuthDto> {
    this.TwoFaAuthStrategy.setStrategy(this.dictionary[this.convertType[type]]);

    return await this.TwoFaAuthStrategy.sendOtp(user);
  }

  public async enableVerification(
    user: UserPayload,
    type: string,
    otp: string,
    hash: string,
  ): Promise<boolean> {
    this.TwoFaAuthStrategy.setStrategy(this.dictionary[this.convertType[type]]);

    const verify: Promise<boolean> = this.TwoFaAuthStrategy.verifyOtp(
      user,
      otp,
      hash,
    );

    const userUpdate = this.userTable.update(user.userId, {
      twoFactorAuth: this.convertType[type],
    });

    return true;
  }
  public async sendOtp(user: UserPayload): Promise<SendOtpTwoFactorAuthDto> {
    this.TwoFaAuthStrategy.setStrategy(this.dictionary[user.twoFactorAuth]);

    return await this.TwoFaAuthStrategy.sendOtp(user);
  }

  public async verifyOtp(
    user: UserPayload,
    otp: string,
    hash: string,
  ): Promise<boolean> {
    this.TwoFaAuthStrategy.setStrategy(this.dictionary[user.twoFactorAuth]);

    return await this.TwoFaAuthStrategy.verifyOtp(user, otp, hash);
  }
}
