import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { LoginService } from './login.service';
import { OauthService } from './oauth.service';
import { ForgotPasswordVerifyOtpDto } from '../dto/forgot-password-verify-otp.dto';
import { UserService } from '../../../user/service/user.service';
import { isNil } from 'lodash';
import { BaseFactoryException } from '../../../../../infrastructure/exceptions/base/base-factory.exception';
import { NotFoundDataException } from '../../../../../infrastructure/exceptions/not-found-data-exception';
import { User } from '../../../../../infrastructure/database/entities/User';
import { SecurityToolsService } from '../../security-tools/security-tools.service';
import { OtpNotMatchException } from '../../../../../infrastructure/exceptions/otp-not-match-exception';
import { UserPayload } from '../dto/user-payload.dto';
import { ChangePasswordDto } from '../../../user/dto/change-password.dto';
import { RedisCacheService } from '../../../../../infrastructure/utils/services/redis-cache.service';
import { LoginProcessResultDto } from '../dto/result/login-process.result.dto';

@Injectable()
export class AuthService {
  constructor(
    public readonly oath: OauthService,
    @Inject(forwardRef(() => LoginService))
    public readonly login: LoginService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly baseFactoryException: BaseFactoryException,
    private readonly securityToolsService: SecurityToolsService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async forgotPassword(
    dto: ForgotPasswordVerifyOtpDto,
  ): Promise<LoginProcessResultDto> {
    const user: User = await this.userService.findByPhoneNumber(
      dto.phoneNumber,
    );

    if (isNil(user)) {
      this.baseFactoryException.handle(NotFoundDataException);
    }

    const verify: boolean = this.securityToolsService.otp.otpVerifier(
      dto.phoneNumber,
      dto.otp,
      dto.hash,
    );

    if (!verify) {
      this.baseFactoryException.handle(OtpNotMatchException);
    }

    const cacheKey: string = user.id + '_changePassword';
    await this.redisCacheService.set(cacheKey, dto.phoneNumber, 480000);

    const userPayload: UserPayload = {
      userId: user.id,
      username: user.username,
      twoFactorAuth: user.twoFactorAuth,
    };

    const changePasswordDto: ChangePasswordDto = {
      otpVerification: true,
      newPassword: dto.newPassword,
    };

    await this.userService.changePassword(userPayload, changePasswordDto);

    return await this.login.loginProcess(userPayload);
  }
}
