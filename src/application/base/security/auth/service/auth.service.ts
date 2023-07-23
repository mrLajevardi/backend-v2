import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserTableService } from '../../../crud/user-table/user-table.service';
import { InvalidPhoneNumberException } from 'src/infrastructure/exceptions/invalid-phone-number.exception';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { SmsService } from 'src/application/base/notification/sms.service';
import { OtpService } from './otp.service';
import { NotificationService } from 'src/application/base/notification/notification.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userTable: UserTableService,
    // private userService: UserService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
    public readonly otp: OtpService,
  ) {}

  // Validate user performs using Local.strategy
  async validateUser(username: string, pass: string): Promise<any> {
    console.log('validate user');
    if (!username) {
      throw new UnauthorizedException('No username provided');
    }

    if (!pass) {
      throw new UnauthorizedException('No password provided');
    }

    const user = await this.userTable.findOne({
      where: { username: username },
    });

    if (!user) {
      throw new UnauthorizedException('Wrong username or password');
    }

    // checking the availablity of the user and
    const isValid = await this.comparePassword(user.password, pass);
    if (user && isValid) {
      // eslint-disable-next-line
      const { password, ...result } = user;

      //console.log(result);
      return result;
    }
    return null;
  }

  // compare two passwordes
  async comparePassword(hashed: string, plain: string): Promise<boolean> {
    return await bcrypt.compare(plain, hashed);
  }

  // This function will be called in AuthController.login after
  // the success of local strategy
  // it will return the JWT token
  async login(user: any) {
    console.log('auth service login', user);
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginAsUser(options, data) {
    const user = await this.userTable.findById(data.userId);
    if (!user) {
      return Promise.reject(new ForbiddenException());
    }
    return this.login(user);
  }
}
