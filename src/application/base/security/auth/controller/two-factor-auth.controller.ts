import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { TwoFaAuthService } from '../service/two-fa-auth.service';
import { SecurityToolsService } from '../../security-tools/security-tools.service';
import { RedisCacheService } from '../../../../../infrastructure/utils/services/redis-cache.service';
import { Public } from '../decorators/ispublic.decorator';
import { TwoFaAuthTypeEnum } from '../enum/two-fa-auth-type.enum';
import { PhoneNumberDto } from '../dto/phoneNumber.dto';
import { SendOtpTwoFactorAuthDto } from '../dto/send-otp-two-factor-auth.dto';
import { User } from '../../../../../infrastructure/database/entities/User';
import { isNil } from 'lodash';
import { UserDoesNotExistException } from '../../../../../infrastructure/exceptions/user-does-not-exist.exception';
import { UserPayload } from '../dto/user-payload.dto';
import { BadRequestException } from '../../../../../infrastructure/exceptions/bad-request.exception';
import { UserService } from '../../../user/service/user.service';
import { VerifyOtpTwoFactorAuthDto } from '../dto/verify-otp-two-factor-auth.dto';
import { AccessTokenDto } from '../dto/access-token.dto';
import { OtpErrorException } from '../../../../../infrastructure/exceptions/otp-error-exception';
import { SessionRequest } from '../../../../../infrastructure/types/session-request.type';
import { EnableTwoFactorAuthenticateDto } from '../dto/enable-two-factor-authenticate.dto';
import { EnableVerifyOtpTwoFactorAuthDto } from '../dto/enable-verify-otp-two-factor-auth.dto';
import { DisableTwoFactorAuthenticateDto } from '../dto/disable-two-factor-authenticate.dto';
import { AuthService } from '../service/auth.service';
import { Throttle } from '@nestjs/throttler';
@ApiTags('TwoFactorAuthentication')
@Controller('auth/twoFactorAuth')
@ApiBearerAuth()
export class TwoFactorAuthController {
  constructor(
    private readonly twoFaAuthService: TwoFaAuthService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Throttle({ default: { limit: 1, ttl: 120000 } })
  @Post('/:TwoFactorType/sendOtp')
  @ApiOperation({
    summary: 'send otp sent to user two factor authenticate',
  })
  @ApiParam({
    name: 'TwoFactorType',
    type: Number,
    description: 'type of two factor authenticate.',
    example: TwoFaAuthTypeEnum.Sms,
  })
  @ApiBody({ type: PhoneNumberDto })
  async sendTwoFactorAuthenticate(
    @Body() data: PhoneNumberDto,
    @Param('TwoFactorType') type: TwoFaAuthTypeEnum,
  ): Promise<SendOtpTwoFactorAuthDto> {
    const user: User = await this.userService.findByPhoneNumber(
      data.phoneNumber,
    );
    if (isNil(user)) {
      throw new UserDoesNotExistException();
    }
    const userPayload: UserPayload = {
      userId: user.id,
      username: user.username,
    };

    const twoFactorTypes: number[] =
      this.twoFaAuthService.parseTwoFactorStrToArray(user.twoFactorAuth);

    if (!twoFactorTypes.includes(Number(type))) {
      throw new BadRequestException();
    }

    const sendOtp = await this.twoFaAuthService.sendOtp(
      userPayload,
      Number(type),
    );

    return sendOtp;
  }

  @Public()
  @Post('/:TwoFactorType/verify')
  @ApiOperation({
    summary: 'verify otp sent to user two factor authenticate',
  })
  @ApiParam({
    name: 'TwoFactorType',
    type: Number,
    description: 'type of two factor authenticate.',
    example: TwoFaAuthTypeEnum.Sms,
  })
  @ApiBody({ type: VerifyOtpTwoFactorAuthDto })
  async verifyTwoFactorAuthenticate(
    @Body() data: VerifyOtpTwoFactorAuthDto,
    @Param('TwoFactorType') type: TwoFaAuthTypeEnum,
  ): Promise<AccessTokenDto> {
    const user: User = await this.userService.findByPhoneNumber(
      data.phoneNumber,
    );

    const twoFactorTypes: number[] =
      this.twoFaAuthService.parseTwoFactorStrToArray(user.twoFactorAuth);

    if (!twoFactorTypes.includes(Number(type))) {
      throw new BadRequestException();
    }

    const userPayload: UserPayload = {
      userId: user.id,
      username: user.username,
    };
    const verifyOtp: boolean = await this.twoFaAuthService.verifyOtp(
      userPayload,
      Number(type),
      data.otp,
      data.hash,
    );

    if (!verifyOtp) {
      throw new OtpErrorException();
    }

    return await this.authService.login.getLoginToken(userPayload.userId);
  }

  @Get('/enable/:twoFactorAuthType')
  @ApiOperation({ summary: 'enable two factor authenticate for current user' })
  // @UseGuards(LocalAuthGuard)
  async enableTwoFactorAuthenticate(
    @Request() req: SessionRequest,
    @Param() twoFactorAuthenticateType: EnableTwoFactorAuthenticateDto,
  ): Promise<SendOtpTwoFactorAuthDto> {
    const data: SendOtpTwoFactorAuthDto = await this.twoFaAuthService.enable(
      req.user,
      twoFactorAuthenticateType.twoFactorAuthType,
    );

    return data;
  }

  @Post('/enable/:twoFactorAuthType/verify')
  @ApiOperation({
    summary: 'verify enable two factor authenticate for current user',
  })
  // @UseGuards(LocalAuthGuard)
  @ApiBody({ type: VerifyOtpTwoFactorAuthDto })
  async verifyEnableTwoFactorAuthenticate(
    @Request() req: SessionRequest,
    @Param() twoFactorAuthenticateType: EnableTwoFactorAuthenticateDto,
    @Body() dto: EnableVerifyOtpTwoFactorAuthDto,
  ): Promise<boolean> {
    return await this.twoFaAuthService.enableVerification(
      req.user,
      twoFactorAuthenticateType.twoFactorAuthType,
      dto.otp,
      dto.hash,
    );
  }

  @Post('/disable')
  @ApiOperation({
    summary:
      'disable specific type of two factor authenticate for current user',
  })
  async disableTwoFactorAuthenticate(
    @Request() req: SessionRequest,
    @Body() dto: DisableTwoFactorAuthenticateDto,
  ): Promise<boolean> {
    return await this.twoFaAuthService.disable(req.user, dto.twoFactorAuthType);
  }
}
