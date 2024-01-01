import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Res,
  Body,
  Param,
  Query,
  Req,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../decorators/ispublic.decorator';
import { LoginDto } from '../dto/login.dto';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { AuthService } from '../service/auth.service';
import { OtpLoginDto } from '../dto/otp-login.dto';
import { GithubLoginDto } from '../dto/github-login.dto';
import { LinkedInAuthGuard } from '../guard/linked-in-auth.guard';
import { LinkedInLoginDto } from '../dto/linked-in-login.dto';
import { GithubAuthGuard } from '../guard/github-auth.guard';
import { OtpAuthGuard } from '../guard/otp-auth.guard';
import { LoginAsUserDto } from '../dto/login-as-user.dto';
import { RegisterByOauthDto } from '../dto/register-by-oauth.dto';
import { GoogleLoginDto } from '../dto/google-login.dto';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { PhoneNumberDto } from '../dto/phoneNumber.dto';
import { SecurityToolsService } from '../../security-tools/security-tools.service';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { CreateUserWithOtpDto } from '../dto/create-user-with-otp.dto';
import { InvalidTokenException } from 'src/infrastructure/exceptions/invalid-token.exception';
import { UserService } from 'src/application/base/user/service/user.service';
import { UserAlreadyExist } from 'src/infrastructure/exceptions/user-already-exist.exception';
import { RobotLoginDto } from '../dto/robot-login.dto';
import { AccessTokenDto } from '../dto/access-token.dto';
import { UserPayload } from '../dto/user-payload.dto';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { OauthService } from '../service/oauth.service';
import { VerifyOauthDto } from '../dto/verify-oauth.dto';
import { GoogleStrategy } from '../strategy/google.strategy';
import { GoogleOAuthGuard } from '../guard/google.auth.guard';
import {
  // LinkedinAuthGuard,
  LinkedinGuardAuth,
} from '../guard/linkedin.auth.guard';
import { TwoFaAuthTypeEnum } from '../enum/two-fa-auth-type.enum';
import { TwoFaAuthService } from '../service/two-fa-auth.service';
import { SendOtpTwoFactorAuthDto } from '../dto/send-otp-two-factor-auth.dto';
import { VerifyOtpTwoFactorAuthDto } from '../dto/verify-otp-two-factor-auth.dto';
import { OtpErrorException } from '../../../../../infrastructure/exceptions/otp-error-exception';
import { EnableTwoFactorAuthenticateDto } from '../dto/enable-two-factor-authenticate.dto';
import { DisableTwoFactorAuthenticateDto } from '../dto/disable-two-factor-authenticate.dto';
import { isNil } from 'lodash';
import { UserDoesNotExistException } from '../../../../../infrastructure/exceptions/user-does-not-exist.exception';
import { BadRequestException } from '../../../../../infrastructure/exceptions/bad-request.exception';
import { User } from '../../../../../infrastructure/database/entities/User';
import { Type } from 'class-transformer';
import { EnableVerifyOtpTwoFactorAuthDto } from '../dto/enable-verify-otp-two-factor-auth.dto';
import { RedisCacheService } from '../../../../../infrastructure/utils/services/redis-cache.service';
import { ChangePasswordDto } from '../../../user/dto/change-password.dto';
import { ForgotPasswordByOtpDto } from '../dto/forgot-password-by-otp.dto';
import { PolicyHandlerOptions } from '../../ability/interfaces/policy-handler.interface';
import { PureAbility, subject } from '@casl/ability';
import { Action } from '../../ability/enum/action.enum';
import { AclSubjectsEnum } from '../../ability/enum/acl-subjects.enum';
import { CheckPolicies } from '../../ability/decorators/check-policies.decorator';

@ApiTags('Auth')
@Controller('auth')
// @CheckPolicies((ability: PureAbility, props: PolicyHandlerOptions) =>
//   ability.can(Action.Manage, subject(AclSubjectsEnum.Auth, props)),
// )
@ApiBearerAuth() // Requires authentication with a JWT token
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFaAuthService: TwoFaAuthService,
    private readonly oauthService: OauthService,
    private readonly securityTools: SecurityToolsService,
    private readonly userService: UserService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  @Public()
  @Get('/sendOtp/:phoneNumber')
  @ApiOperation({ summary: 'generate otp and send it to user' })
  @ApiParam({
    name: 'phoneNumber',
    type: String,
    description: 'The phone number to send otp.',
    example: '09121121212',
  })
  async sendOtp(
    @Param() dto: PhoneNumberDto,
  ): Promise<{ phoneNumber: string; hash: string }> {
    const otp = await this.authService.login.generateOtp(dto.phoneNumber);
    return {
      phoneNumber: dto.phoneNumber,
      hash: otp.hash,
    };
  }

  @Public()
  @Get('/getTwoFactorTypes/:phoneNumber')
  @ApiOperation({ summary: 'get user two factor types by phone number' })
  @ApiParam({
    name: 'phoneNumber',
    type: String,
    description: 'The phone number to get two factor types.',
    example: '09121121212',
  })
  async getUserTwoFactorTypes(@Param() dto: PhoneNumberDto): Promise<number[]> {
    const user = await this.userService.findByPhoneNumber(dto.phoneNumber);
    if (isNil(user)) {
      throw new UserDoesNotExistException();
    }

    const data: number[] = await this.twoFaAuthService.getUserTwoFactorTypes(
      user.id,
    );

    return data;
  }

  @Public()
  @Post('/verifyOtp')
  @ApiOperation({ summary: 'verify Otp password' })
  async verifyOtp(@Body() dto: VerifyOtpDto): Promise<boolean> {
    return await this.securityTools.otp.otpVerifier(
      dto.phoneNumber,
      dto.otp,
      dto.hash,
    );
  }

  @Public()
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Returns the JWT token' })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: SessionRequest): Promise<any> {
    return await this.authService.login.loginProcess(req.user);
  }

  // @Public()
  // @Post('/twoFactorAuth/:TwoFactorType/sendOtp')
  // @ApiOperation({
  //   summary: 'send otp sent to user two factor authenticate',
  // })
  // @ApiParam({
  //   name: 'TwoFactorType',
  //   type: Number,
  //   description: 'type of two factor authenticate.',
  //   example: TwoFaAuthTypeEnum.Sms,
  // })
  // @ApiBody({ type: PhoneNumberDto })
  // async sendTwoFactorAuthenticate(
  //   @Body() data: PhoneNumberDto,
  //   @Param('TwoFactorType') type: TwoFaAuthTypeEnum,
  // ): Promise<SendOtpTwoFactorAuthDto> {
  //   const user: User = await this.userService.findByPhoneNumber(
  //     data.phoneNumber,
  //   );
  //   if (isNil(user)) {
  //     throw new UserDoesNotExistException();
  //   }
  //   const userPayload: UserPayload = {
  //     userId: user.id,
  //     username: user.username,
  //   };
  //
  //   const twoFactorTypes: number[] =
  //     this.twoFaAuthService.parseTwoFactorStrToArray(user.twoFactorAuth);
  //
  //   if (!twoFactorTypes.includes(Number(type))) {
  //     throw new BadRequestException();
  //   }
  //
  //   const sendOtp = await this.twoFaAuthService.sendOtp(
  //     userPayload,
  //     Number(type),
  //   );
  //
  //   return sendOtp;
  // }

  // @Public()
  // @Post('/twoFactorAuth/:TwoFactorType/verify')
  // @ApiOperation({
  //   summary: 'verify otp sent to user two factor authenticate',
  // })
  // @ApiParam({
  //   name: 'TwoFactorType',
  //   type: Number,
  //   description: 'type of two factor authenticate.',
  //   example: TwoFaAuthTypeEnum.Sms,
  // })
  // @ApiBody({ type: VerifyOtpTwoFactorAuthDto })
  // async verifyTwoFactorAuthenticate(
  //   @Body() data: VerifyOtpTwoFactorAuthDto,
  //   @Param('TwoFactorType') type: TwoFaAuthTypeEnum,
  // ): Promise<AccessTokenDto> {
  //   const user: User = await this.userService.findByPhoneNumber(
  //     data.phoneNumber,
  //   );
  //
  //   const twoFactorTypes: number[] =
  //     this.twoFaAuthService.parseTwoFactorStrToArray(user.twoFactorAuth);
  //
  //   if (!twoFactorTypes.includes(Number(type))) {
  //     throw new BadRequestException();
  //   }
  //
  //   const userPayload: UserPayload = {
  //     userId: user.id,
  //     username: user.username,
  //   };
  //   const verifyOtp: boolean = await this.twoFaAuthService.verifyOtp(
  //     userPayload,
  //     Number(type),
  //     data.otp,
  //     data.hash,
  //   );
  //
  //   if (!verifyOtp) {
  //     throw new OtpErrorException();
  //   }
  //
  //   return await this.authService.login.getLoginToken(userPayload.userId);
  // }
  //
  // @Get('/twoFactorAuth/enable/:twoFactorAuthType')
  // @ApiOperation({ summary: 'enable two factor authenticate for current user' })
  // // @UseGuards(LocalAuthGuard)
  // async enableTwoFactorAuthenticate(
  //   @Request() req: SessionRequest,
  //   @Param() twoFactorAuthenticateType: EnableTwoFactorAuthenticateDto,
  // ): Promise<SendOtpTwoFactorAuthDto> {
  //   const data: SendOtpTwoFactorAuthDto = await this.twoFaAuthService.enable(
  //     req.user,
  //     twoFactorAuthenticateType.twoFactorAuthType,
  //   );
  //
  //   return data;
  // }
  //
  // @Post('/twoFactorAuth/enable/:twoFactorAuthType/verify')
  // @ApiOperation({
  //   summary: 'verify enable two factor authenticate for current user',
  // })
  // // @UseGuards(LocalAuthGuard)
  // @ApiBody({ type: VerifyOtpTwoFactorAuthDto })
  // async verifyEnableTwoFactorAuthenticate(
  //   @Request() req: SessionRequest,
  //   @Param() twoFactorAuthenticateType: EnableTwoFactorAuthenticateDto,
  //   @Body() dto: EnableVerifyOtpTwoFactorAuthDto,
  // ): Promise<boolean> {
  //   return await this.twoFaAuthService.enableVerification(
  //     req.user,
  //     twoFactorAuthenticateType.twoFactorAuthType,
  //     dto.otp,
  //     dto.hash,
  //   );
  // }
  //
  // @Post('/twoFactorAuth/disable')
  // @ApiOperation({
  //   summary:
  //     'disable specific type of two factor authenticate for current user',
  // })
  // async disableTwoFactorAuthenticate(
  //   @Request() req: SessionRequest,
  //   @Body() dto: DisableTwoFactorAuthenticateDto,
  // ): Promise<boolean> {
  //   return await this.twoFaAuthService.disable(req.user, dto.twoFactorAuthType);
  // }

  @Public()
  @Post('/robot/login')
  @ApiBody({
    type: RobotLoginDto,
    description: 'Local server api token for automated tasks',
  })
  async robotLogin(@Body() dto: RobotLoginDto): Promise<AccessTokenDto> {
    return this.authService.login.getRobotLoginToken(dto.token);
  }

  @Public()
  @ApiOperation({ summary: 'OTP login' })
  @ApiResponse({ status: 200, description: 'Returns the JWT token' })
  @ApiBody({ type: OtpLoginDto })
  @UseGuards(OtpAuthGuard)
  @Post('otpLogin')
  async otpLogin(@Request() req: SessionRequest): Promise<UserPayload> {
    return req.user;
  }

  @Public()
  @Get('github')
  // @ApiQuery({ type: GithubLoginDto })
  @UseGuards(GithubAuthGuard)
  async githubLogin(
    @Request() req: SessionRequest,
    // githubLoginDto: GithubLoginDto,
  ): Promise<VerifyOauthDto> {
    // return this.oauthService.verifyGithubOauth(githubLoginDto.code);
    return this.oauthService.verifyGithubOauth(req);
    // return req.user;
  }

  @Public()
  @Get('linkedin')
  // @ApiQuery({ type: LinkedInLoginDto })
  @UseGuards(LinkedinGuardAuth)
  async linkedInLogin(
    @Request() req,
    // linkedInLoginDto: LinkedInLoginDto,
  ): Promise<VerifyOauthDto> {
    return this.oauthService.verifyLinkedinOauth(req);
  }

  @Public()
  // @Get('google')
  //  @ApiQuery({ type: String, name: 'code' })
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  // @UseGuards(AuthGuard('google'))
  async googleLogin(@Request() req): Promise<VerifyOauthDto> {
    return this.oauthService.verifyGoogleOauth(req.user);
    // return req.user;
  }

  @Public()
  @Get('googleUrl')
  getGoogleUrl(): { consentUrl: string } {
    const consentURL = this.authService.oath.getGoogleConsentURL();
    return {
      consentUrl: consentURL,
    };
  }

  @Public()
  @Get('linkedInUrl')
  getLinkedInUrl(): { consentUrl: string } {
    const consentURL = this.authService.oath.getLinkedInUrl();
    return {
      consentUrl: consentURL,
    };
  }

  @Public()
  @Get('gitHUbUrl')
  getGitHUbUrl(): { consentUrl: string } {
    const consentURL = this.authService.oath.getGitHubUrl();
    return {
      consentUrl: consentURL,
    };
  }

  @Post('/loginAsUser')
  @ApiOperation({ summary: 'login admin as a user' })
  @ApiBody({ type: LoginAsUserDto })
  @ApiResponse({
    status: 200,
    description: 'Logged in successfully',
    type: LoginAsUserDto,
  })
  async loginAsUser(
    @Body() data: LoginAsUserDto,
    @Request() options: SessionRequest,
  ): Promise<AccessTokenDto> {
    const currentUserId = options.user.userId;
    const userCredentials = await this.authService.login.getLoginToken(
      currentUserId,
      data.userId,
    );
    return userCredentials;
  }

  @Post('/revertBackToOriginalUser')
  @ApiOperation({
    summary: 'if you used login as user, you can revert back to original user',
  })
  @ApiResponse({
    status: 200,
    description: 'Logged in successfully',
  })
  async revertBackToOriginalUser(
    @Request() options: SessionRequest,
  ): Promise<AccessTokenDto> {
    if (!options.user.originalUser) {
      throw new ForbiddenException();
    }
    return this.authService.login.getLoginToken(
      options.user.originalUser.userId,
    );
  }

  @Public()
  @Post('registerByOauth')
  @ApiOperation({ summary: 'user credit' })
  @ApiBody({ type: RegisterByOauthDto })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: RegisterByOauthDto,
  })
  async registerByOauth(
    @Body() data: RegisterByOauthDto,
    @Request() options: SessionRequest,
  ): Promise<AccessTokenDto> {
    return this.authService.oath.registerByOauth(options, data);
  }

  @Public()
  @Post('registerByOtp')
  @ApiOperation({ summary: 'register user with otp ' })
  @ApiBody({ type: CreateUserWithOtpDto })
  async registerByOtp(
    @Body() dto: CreateUserWithOtpDto,
  ): Promise<AccessTokenDto> {
    // checking if the user exists or not
    const userExist = await this.userService.checkPhoneNumber(dto.phoneNumber);

    if (userExist) {
      throw new UserAlreadyExist();
    }
    const verify = this.securityTools.otp.otpVerifier(
      dto.phoneNumber,
      dto.otp,
      dto.hash,
    );
    if (!verify) {
      throw new InvalidTokenException();
    }
    const user = await this.userService.createUserByPhoneNumber(
      dto.phoneNumber,
      dto.password,
    );

    return await this.authService.login.getLoginToken(user.id);
  }

  @Public()
  @Get('forgot-password/sendOtp/:phoneNumber')
  @ApiOperation({ summary: 'send otp to phone number for changing password' })
  async sendOtpChangingPassword(@Param() dto: PhoneNumberDto) {
    const user: User = await this.userService.findByPhoneNumber(
      dto.phoneNumber,
    );

    if (isNil(user)) {
      throw new UserDoesNotExistException();
    }

    const otp = await this.authService.login.generateOtp(user.phoneNumber);

    return {
      phoneNumber: dto.phoneNumber,
      hash: otp.hash,
    };
  }

  @Public()
  @Post('forgot-password/verifyOtp')
  @ApiOperation({
    summary: 'verify otp sent to phone number for changing password',
  })
  async verifyOtpChangingPassword(
    @Body() data: VerifyOtpDto,
  ): Promise<boolean> {
    const user: User = await this.userService.findByPhoneNumber(
      data.phoneNumber,
    );

    if (isNil(user)) {
      throw new UserDoesNotExistException();
    }

    const verify: boolean = this.securityTools.otp.otpVerifier(
      data.phoneNumber,
      data.otp,
      data.hash,
    );

    if (!verify) {
      throw new OtpErrorException();
    }

    const cacheKey: string = user.id + '_changePassword';
    await this.redisCacheService.set(cacheKey, data.phoneNumber, 480000);

    return true;
  }

  @Public()
  @Put('forgot-password')
  @ApiOperation({ summary: 'change password for current user ' })
  async changePassword(
    @Body() dto: ForgotPasswordByOtpDto,
  ): Promise<AccessTokenDto> {
    const user: User = await this.userService.findByPhoneNumber(
      dto.phoneNumber,
    );

    if (isNil(user)) {
      throw new UserDoesNotExistException();
    }
    const userPayload: UserPayload = {
      userId: user.id,
      username: user.username,
      twoFactorAuth: user.twoFactorAuth,
    };
    const data: ChangePasswordDto = {
      otpVerification: true,
      newPassword: dto.password,
    };

    await this.userService.changePassword(userPayload, data);

    return await this.authService.login.getLoginToken(userPayload.userId);
  }
}
