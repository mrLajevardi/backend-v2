import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Res,
  Body,
  Param,
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

@ApiTags('Auth')
@Controller('auth')
@ApiBearerAuth() // Requires authentication with a JWT token
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly oauthService: OauthService,
    private readonly securityTools: SecurityToolsService,
    private readonly userService: UserService,
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
  async login(@Request() req: SessionRequest): Promise<AccessTokenDto> {
    console.log('login', req.user);
    return this.authService.login.getLoginToken(req.user.userId);
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
  @ApiQuery({ type: GithubLoginDto })
  @UseGuards(GithubAuthGuard)
  async githubLogin(
    @Request() req: SessionRequest,
    githubLoginDto: GithubLoginDto,
  ): Promise<VerifyOauthDto | AccessTokenDto> {
    return this.oauthService.verifyGithubOauth(githubLoginDto.code);
    // return req.user;
  }

  @Public()
  @Get('linkedin')
  @ApiQuery({ type: LinkedInLoginDto })
  @UseGuards(LinkedInAuthGuard)
  async linkedInLogin(
    @Request() req: SessionRequest,
    linkedInLoginDto: LinkedInLoginDto,
  ): Promise<VerifyOauthDto | AccessTokenDto> {
    return this.oauthService.verifyLinkedinOauth(linkedInLoginDto.code);
    // return req.user;
  }

  @Public()
  @Get('google/:code')
  @ApiParam({ name: 'code', description: 'oauth code' })
  // @UseGuards(AuthGuard('google'))
  async googleLogin(
    @Param('code')
    code: string,
  ): Promise<VerifyOauthDto | AccessTokenDto> {
    return this.oauthService.verifyGoogleOauth(code);
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
    @Res() res: Response,
  ): Promise<Response> {
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
    await this.userService.createUserByPhoneNumber(
      dto.phoneNumber,
      dto.password,
    );
    return res.status(200).json({ message: 'User created successfully' });
  }
}
