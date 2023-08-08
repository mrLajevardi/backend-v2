import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserTableService } from '../../../crud/user-table/user-table.service';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { NotificationService } from 'src/application/base/notification/notification.service';
import * as bcrypt from 'bcrypt';
import { comparePassword } from 'src/infrastructure/helpers/helpers';
import { User } from 'src/infrastructure/database/entities/User';
import { isEmpty } from 'lodash';
import { InvalidPhoneNumberException } from 'src/infrastructure/exceptions/invalid-phone-number.exception';
import { OtpService } from '../../security-tools/otp.service';

@Injectable()
export class LoginService {
  constructor(
    private userTable: UserTableService,
    // private userService: UserService,
    private jwtService: JwtService,
    private otpService: OtpService,
    private notificationService: NotificationService,
  ) {}

  // generates a phone otp and return the hash
  async generateOtp(phoneNumber: string): Promise<string | null> {
    let hash = null;

    const otpGenerated = this.otpService.otpGenerator(phoneNumber);
    hash = otpGenerated.hash;
    console.log(otpGenerated);
    try {
      await this.notificationService.sms.sendSMS(phoneNumber, otpGenerated.otp);
    } catch (error) {
      return null;
    }

    return hash;
  }

  // Validate user performs using Local.strategy
  async validateUser(username: string, pass: string): Promise<any> {
    console.log('validate user');
    if (!username) {
      throw new UnauthorizedException();
    }

    if (!pass) {
      throw new UnauthorizedException();
    }

    const user = await this.userTable.findOne({
      where: { username: username },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    // checking the availablity of the user and
    const isValid = await comparePassword(user.password, pass);
    if (user && isValid) {
      // eslint-disable-next-line
      const { password, ...result } = user;

      //console.log(result);
      return result;
    }
    return null;
  }

  // This function will be called in AuthController.login after
  // the success of local strategy
  // it will return the JWT token
  async getLoginToken(userId: number, impersonateId?: number) {
    console.log('getLoginToken', userId, impersonateId);
    if (!userId) {
      throw new UnauthorizedException();
    }
    const user: User = await this.userTable.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    let impersonateAs: User = null;
    if (impersonateId) {
      impersonateAs = await this.userTable.findById(impersonateId);
    }
    const payload = {
      username: user.username,
      sub: user.id,
      impersonateAs: !isEmpty(impersonateAs)
        ? {
            username: impersonateAs.username,
            userId: impersonateAs.id,
          }
        : null,
    };
    console.log(payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
