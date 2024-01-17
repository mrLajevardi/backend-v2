import { Injectable } from '@nestjs/common';
import { UserTableService } from '../../../crud/user-table/user-table.service';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { UserPayload } from '../dto/user-payload.dto';
import { User } from '../../../../../infrastructure/database/entities/User';
import {
  SendQrCodeTwoFactorAuthDto,
  BaseSendTwoFactorAuthDto,
} from '../dto/send-otp-two-factor-auth.dto';
import { TwoFaAuthInterface } from './interface/two-fa-auth.interface';
import { isNil } from 'lodash';
import { ForbiddenException } from '../../../../../infrastructure/exceptions/forbidden.exception';

@Injectable()
export class TwoFaAuthTotpService implements TwoFaAuthInterface {
  constructor(private userTable: UserTableService) {}

  async sendOtp(userPayload: UserPayload): Promise<BaseSendTwoFactorAuthDto> {
    const user: User = await this.userTable.findById(userPayload.userId);

    const secret = speakeasy.generateSecret({ length: 20 });

    await this.userTable.update(userPayload.userId, {
      totpSecretKey: secret.base32,
    });

    const otpAuthUrl = speakeasy.otpauthURL({
      secret: secret.ascii,
      label: user.phoneNumber,
      issuer: 'aradcloud.com',
      algorithm: 'sha512',
    });
    const qrCode = await qrcode.toDataURL(otpAuthUrl);

    return {
      qrCode: qrCode,
    } as SendQrCodeTwoFactorAuthDto;
  }

  async verifyOtp(userPayload: UserPayload, totp: string): Promise<boolean> {
    const user: User = await this.userTable.findById(userPayload.userId);

    if (isNil(user.totpSecretKey)) {
      throw new ForbiddenException();
    }

    return speakeasy.totp.verify({
      secret: user.totpSecretKey,
      encoding: 'base32',
      algorithm: 'sha512',
      token: totp,
      window: 4,
    });
  }
}
