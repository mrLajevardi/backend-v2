import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../decorators/ispublic.decorator';
import { LoginDto } from '../dto/login.dto';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { AuthService } from '../service/auth.service';
import { OtpLoginDto } from '../dto/otp-login.dto';
import { GithubAuthGuard } from '../guard/github-auth.guard';
import { OtpAuthGuard } from '../guard/otp-auth.guard';
import { LoginAsUserDto } from '../dto/login-as-user.dto';
import { RegisterByOauthDto } from '../dto/register-by-oauth.dto';
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
import { OauthService } from '../service/oauth.service';
import { VerifyOauthDto } from '../dto/verify-oauth.dto';
import { GoogleOAuthGuard } from '../guard/google.auth.guard';
import {
  // LinkedinAuthGuard,
  LinkedinGuardAuth,
} from '../guard/linkedin.auth.guard';
import { TwoFaAuthService } from '../service/two-fa-auth.service';
import { isNil } from 'lodash';
import { UserDoesNotExistException } from '../../../../../infrastructure/exceptions/user-does-not-exist.exception';
import { User } from '../../../../../infrastructure/database/entities/User';
import { RedisCacheService } from '../../../../../infrastructure/utils/services/redis-cache.service';
import { ChangePasswordDto } from '../../../user/dto/change-password.dto';
import { ForgotPasswordByOtpDto } from '../dto/forgot-password-by-otp.dto';
import { OtpNotMatchException } from '../../../../../infrastructure/exceptions/otp-not-match-exception';
import { Throttle } from '@nestjs/throttler';
import { ForgotPasswordVerifyOtpDto } from '../dto/forgot-password-verify-otp.dto';
import { BaseFactoryException } from '../../../../../infrastructure/exceptions/base/base-factory.exception';
import { LoginProcessResultDto } from '../dto/result/login-process.result.dto';

@ApiTags('Auth')
@Controller('auth')
@ApiBearerAuth() // Requires authentication with a JWT token
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFaAuthService: TwoFaAuthService,
    private readonly oauthService: OauthService,
    private readonly securityTools: SecurityToolsService,
    private readonly userService: UserService,
    private readonly redisCacheService: RedisCacheService,
    private readonly baseFactoryException: BaseFactoryException,
  ) {}

  @Public()
  // @Throttle({ default: { limit: 1, ttl: 120000 } })
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
  @ApiResponse({
    type: LoginProcessResultDto,
    status: 200,
    description: 'Returns the JWT token',
  })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: SessionRequest): Promise<any> {
    return await this.authService.login.loginProcess(req.user);
  }

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
  // @Throttle({ default: { limit: 1, ttl: 120000 } })
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
  @ApiResponse({
    type: LoginProcessResultDto,
    description:
      "if user has two factor authenticate , response have two_factor_authenticate and types , if doesn't have two factor authenticate , response have two_factor_authenticate and access_token and ai_token",
  })
  async verifyOtpChangingPassword(
    @Body() data: ForgotPasswordVerifyOtpDto,
  ): Promise<LoginProcessResultDto> {
    return await this.authService.forgotPassword(data);
  }
}
