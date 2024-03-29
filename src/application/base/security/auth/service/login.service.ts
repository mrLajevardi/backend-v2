import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserTableService } from '../../../crud/user-table/user-table.service';
import { NotificationService } from 'src/application/base/notification/notification.service';
import { comparePassword } from 'src/infrastructure/helpers/helpers';
import { User } from 'src/infrastructure/database/entities/User';
import { isEmpty, isNil } from 'lodash';
import { OtpService } from '../../security-tools/otp.service';
import { AccessTokenDto } from '../dto/access-token.dto';
import { OtpErrorException } from 'src/infrastructure/exceptions/otp-error-exception';
import { UserPayload } from '../dto/user-payload.dto';
import { TwoFaAuthTypeEnum } from '../enum/two-fa-auth-type.enum';
import { SendOtpTwoFactorAuthDto } from '../dto/send-otp-two-factor-auth.dto';
import { TwoFaAuthService } from './two-fa-auth.service';
import axios from 'axios';
// import { UserIsDeletedException } from '../../../../../infrastructure/exceptions/user-is-deleted.exception';
import { UserIsNotActiveException } from '../../../../../infrastructure/exceptions/user-is-not-active.exception';
import { UserIsDeletedException } from '../../../../../infrastructure/exceptions/user-is-deleted.exception';
import { LoginProcessResultDto } from '../dto/result/login-process.result.dto';

// import process from 'process';

@Injectable()
export class LoginService {
  constructor(
    private userTable: UserTableService,
    private jwtService: JwtService,
    private otpService: OtpService,
    private notificationService: NotificationService,
    @Inject(forwardRef(() => TwoFaAuthService))
    private twoFaAuthService: TwoFaAuthService,
  ) {}

  // generates a phone otp and return the hash
  async generateOtp(
    phoneNumber: string,
    sendSMS = true,
  ): Promise<{ otp: string; hash: string }> {
    const otpGenerated = this.otpService.otpGenerator(phoneNumber);
    if (!otpGenerated) {
      throw new OtpErrorException();
    }

    try {
      if (sendSMS) {
        await this.notificationService.sms.sendSMS(
          phoneNumber,
          otpGenerated.otp,
        );
      }
    } catch (error) {
      return null;
    }

    return { otp: otpGenerated.otp, hash: otpGenerated.hash };
  }

  // Validate user performs using Local.strategy
  async validateUser(username: string, pass: string): Promise<any> {
    console.log('validate user');

    if (!username || !pass) {
      throw new UnauthorizedException();
    }

    const user = await this.userTable.findOne({
      where: { username: username },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.deleted) {
      await this.userTable.update(user.id, {
        deleted: false,
        active: false,
      });
      throw new UserIsDeletedException();
    }

    if (!user.active) {
      throw new UserIsNotActiveException();
    }

    const isValid = await comparePassword(user.password, pass);
    if (user && isValid) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async getRobotLoginToken(token: string): Promise<AccessTokenDto> {
    const systemToken = process.env.ROBOT_TOKEN;

    console.log(token, systemToken);
    if (isEmpty(systemToken) || isEmpty(token)) {
      return Promise.reject(new UnauthorizedException());
    }

    if (token != systemToken) {
      return Promise.reject(new UnauthorizedException());
    }

    const payload = {
      isRobot: true,
      robotToken: token,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // This function will be called in AuthController.login after
  // the success of local strategy
  // it will return the JWT token
  async getLoginToken(
    userId: number,
    impersonateId?: number,
    aiAccessToken?: string,
  ): Promise<AccessTokenDto> {
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
      userId: user.id,
      guid: user.guid,
      personalVerification: user.personalVerification,
      impersonateAs: !isEmpty(impersonateAs)
        ? {
            guid: impersonateAs.guid,
            username: impersonateAs.username,
            userId: impersonateAs.id,
            personalVerification: impersonateAs.personalVerification,
          }
        : null,
    };
    if (isNil(aiAccessToken)) {
      try {
        const axiosConfig = {
          headers: {
            Authorization: process.env.AI_BACK_TOKEN,
            Accept: '*',
            'Content-Type': 'application/json',
          },
        };
        const aiToken: string = null;
        const aiUrl = process.env.AI_BACK_URL + '/api/Cloud/login';

        const phoneNumber = impersonateAs?.phoneNumber ?? user.phoneNumber;
        const aiRequest = await axios.post(
          aiUrl,
          {
            phoneNumber: phoneNumber,
          },
          axiosConfig,
        );
        if (aiRequest.status == 200) {
          aiAccessToken = aiRequest.data.token;
        }
      } catch (error) {
        console.log('Axios request failed:', error);
      }
    }

    return {
      access_token: this.jwtService.sign(payload),
      ai_token: aiAccessToken,
    };
  }

  async loginProcess(user: UserPayload): Promise<LoginProcessResultDto> {
    // if (!user.twoFactorAuth || user.twoFactorAuth === TwoFaAuthTypeEnum.None) {
    if (
      user.twoFactorAuth.split(',').includes(TwoFaAuthTypeEnum.None.toString())
    ) {
      const tokens: AccessTokenDto = await this.getLoginToken(
        user.userId,
        null,
        user.aiAccessToken,
      );

      return {
        two_factor_authenticate: false,
        ...tokens,
      } as LoginProcessResultDto;
    }

    const twoFactorTypes: number[] =
      await this.twoFaAuthService.getUserTwoFactorTypes(user.userId);

    return {
      two_factor_authenticate: true,
      types: twoFactorTypes,
    } as LoginProcessResultDto;
  }

  async reGenerateTokens(
    userId: number,
    impersonateId?: number,
  ): Promise<AccessTokenDto> {
    return await this.getLoginToken(userId, impersonateId);
  }
}
