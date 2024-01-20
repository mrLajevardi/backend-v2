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

  base32ToAscii(base32String: string): string {
    const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

    // Remove padding characters
    base32String = base32String.replace(/=+$/, '');

    let bits = 0;
    let value = 0;
    let result = '';

    for (const char of base32String) {
      const charValue = base32Chars.indexOf(char.toUpperCase());

      if (charValue === -1) {
        throw new Error(`Invalid Base32 character: ${char}`);
      }

      value = (value << 5) | charValue;
      bits += 5;

      if (bits >= 8) {
        result += String.fromCharCode((value >>> (bits - 8)) & 0xff);
        bits -= 8;
      }
    }

    return result;
  }

  async sendOtp(userPayload: UserPayload): Promise<BaseSendTwoFactorAuthDto> {
    const user: User = await this.userTable.findById(userPayload.userId);

    let secretKey = null;

    if (isNil(user.totpSecretKey)) {
      const secret = speakeasy.generateSecret({ length: 20 });
      secretKey = secret.ascii;
      await this.userTable.update(userPayload.userId, {
        totpSecretKey: secret.base32,
      });
    } else {
      secretKey = this.base32ToAscii(user.totpSecretKey);
    }

    const otpAuthUrl = speakeasy.otpauthURL({
      secret: secretKey,
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
