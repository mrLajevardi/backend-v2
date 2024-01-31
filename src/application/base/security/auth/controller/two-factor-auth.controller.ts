import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TwoFaAuthService } from '../service/two-fa-auth.service';
import { Public } from '../decorators/ispublic.decorator';
import { TwoFaAuthTypeEnum } from '../enum/two-fa-auth-type.enum';
import { PhoneNumberDto } from '../dto/phoneNumber.dto';
import {
  BaseSendTwoFactorAuthDto,
  BaseSendTwoFactorAuthDtoSwagger,
  SendOtpTwoFactorAuthDto,
} from '../dto/send-otp-two-factor-auth.dto';
import { VerifyOtpTwoFactorAuthDto } from '../dto/verify-otp-two-factor-auth.dto';
import { AccessTokenDto } from '../dto/access-token.dto';
import { SessionRequest } from '../../../../../infrastructure/types/session-request.type';
import { EnableTwoFactorAuthenticateDto } from '../dto/enable-two-factor-authenticate.dto';
import { EnableVerifyOtpTwoFactorAuthDto } from '../dto/enable-verify-otp-two-factor-auth.dto';
import { DisableTwoFactorAuthenticateDto } from '../dto/disable-two-factor-authenticate.dto';
import { Throttle } from '@nestjs/throttler';
@ApiTags('TwoFactorAuthentication')
@Controller('auth/twoFactorAuth')
@ApiBearerAuth()
export class TwoFactorAuthController {
  constructor(private readonly twoFaAuthService: TwoFaAuthService) {}

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
  @ApiResponse({
    // TwoFaAuthTypeEnum.Totp doesn't have hash sendOtp
    type: SendOtpTwoFactorAuthDto,
  })
  async sendTwoFactorAuthenticate(
    @Body() data: PhoneNumberDto,
    @Param('TwoFactorType') type: TwoFaAuthTypeEnum,
  ): Promise<BaseSendTwoFactorAuthDto> {
    return await this.twoFaAuthService.sendOtpByPhoneNumber(
      data.phoneNumber,
      Number(type),
    );
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
    return await this.twoFaAuthService.verifyOtpProcess(data, type);
  }

  @Get('/enable/:twoFactorAuthType')
  @ApiOperation({ summary: 'enable two factor authenticate for current user' })
  // @UseGuards(LocalAuthGuard)
  @ApiResponse({
    type: BaseSendTwoFactorAuthDtoSwagger,
    description:
      "sms , email twoFactor have hash but totp doesn't have hash it's have qrCode ",
  })
  async enableTwoFactorAuthenticate(
    @Request() req: SessionRequest,
    @Param() twoFactorAuthenticateType: EnableTwoFactorAuthenticateDto,
  ): Promise<BaseSendTwoFactorAuthDto> {
    const data: BaseSendTwoFactorAuthDto = await this.twoFaAuthService.enable(
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
      dto.hash ?? null,
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
