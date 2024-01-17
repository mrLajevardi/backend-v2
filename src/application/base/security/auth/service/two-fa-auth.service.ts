import { BadRequestException, Injectable } from '@nestjs/common';
import { UserPayload } from '../dto/user-payload.dto';
import { TwoFaAuthTypeService } from '../classes/two-fa-auth-type.service';
import { TwoFaAuthTypeEnum } from '../enum/two-fa-auth-type.enum';
import { TwoFaAuthStrategy } from '../classes/two-fa-auth.strategy';
import {
  BaseSendTwoFactorAuthDto,
  SendOtpTwoFactorAuthDto,
} from '../dto/send-otp-two-factor-auth.dto';
import { UserTableService } from '../../../crud/user-table/user-table.service';
import { User } from '../../../../../infrastructure/database/entities/User';

@Injectable()
export class TwoFaAuthService {
  constructor(
    private TwoFaAuthType: TwoFaAuthTypeService,
    private TwoFaAuthStrategy: TwoFaAuthStrategy,
    private readonly userTable: UserTableService,
  ) {}

  private dictionary = {
    [TwoFaAuthTypeEnum.Sms]: this.TwoFaAuthType.sms,
    [TwoFaAuthTypeEnum.Email]: this.TwoFaAuthType.email,
    [TwoFaAuthTypeEnum.Totp]: this.TwoFaAuthType.totp,
  };

  private convertType = {
    sms: 1,
    email: 2,
    totp: 3,
  };

  public async enable(
    user: UserPayload,
    type: TwoFaAuthTypeEnum,
  ): Promise<BaseSendTwoFactorAuthDto> {
    this.TwoFaAuthStrategy.setStrategy(this.dictionary[type]);

    return await this.TwoFaAuthStrategy.enableOtp(user);
  }

  public async disable(user: UserPayload, type: TwoFaAuthTypeEnum) {
    const twoFactorTypes: number[] = await this.getUserTwoFactorTypes(
      user.userId,
    );
    const indexOfType: number = twoFactorTypes.indexOf(type);

    if (indexOfType !== -1 && TwoFaAuthTypeEnum.None !== type) {
      twoFactorTypes.splice(indexOfType, 1);
    } else {
      throw new BadRequestException();
    }

    if (twoFactorTypes.length == 0) {
      twoFactorTypes.push(TwoFaAuthTypeEnum.None);
    }

    await this.userTable.update(user.userId, {
      twoFactorAuth: twoFactorTypes.join(','),
    });

    return true;
  }

  public async enableVerification(
    user: UserPayload,
    type: TwoFaAuthTypeEnum,
    otp: string,
    hash?: string,
  ): Promise<boolean> {
    this.TwoFaAuthStrategy.setStrategy(this.dictionary[Number(type)]);

    const verify: boolean = await this.TwoFaAuthStrategy.enableVerifyOtp(
      user,
      otp,
      hash,
    );

    if (!verify) {
      throw new BadRequestException();
    }

    const twoFactors: number[] = await this.getUserTwoFactorTypes(user.userId);

    const noneIndex = twoFactors.indexOf(TwoFaAuthTypeEnum.None);
    if (noneIndex !== -1) {
      twoFactors.splice(noneIndex, 1);
    }

    twoFactors.push(Number(type));

    const newTwoFactors = [...new Set(twoFactors)];
    const twoFactorsStr = newTwoFactors.join(',');

    await this.userTable.update(user.userId, {
      twoFactorAuth: twoFactorsStr,
    });

    return true;
  }

  public async sendOtp(
    user: UserPayload,
    type: TwoFaAuthTypeEnum,
  ): Promise<BaseSendTwoFactorAuthDto> {
    const twoFactorTypes: number[] = await this.getUserTwoFactorTypes(
      user.userId,
    );

    if (type == TwoFaAuthTypeEnum.None || !twoFactorTypes.includes(type)) {
      throw new BadRequestException();
    }

    this.TwoFaAuthStrategy.setStrategy(this.dictionary[type]);

    return await this.TwoFaAuthStrategy.sendOtp(user);
  }

  public async verifyOtp(
    user: UserPayload,
    type: TwoFaAuthTypeEnum,
    otp: string,
    hash?: string,
  ): Promise<boolean> {
    this.TwoFaAuthStrategy.setStrategy(this.dictionary[type]);

    return await this.TwoFaAuthStrategy.verifyOtp(user, otp, hash);
  }

  public async getUserTwoFactorTypes(userId: number): Promise<number[]> {
    const user: User = await this.userTable.findById(userId);

    return this.parseTwoFactorStrToArray(user.twoFactorAuth);
  }

  public parseTwoFactorStrToArray(twoFactorTypes: string) {
    return String(twoFactorTypes)
      .split(',')
      .map((item) => Number(item));
  }
}
