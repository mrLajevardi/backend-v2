import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Req,
  Res,
  Body,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../decorators/ispublic.decorator';
import { LoginDto } from '../dto/login.dto';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { AuthService } from '../service/auth.service';
import { OtpLoginDto } from '../dto/otp-login.dto';
import { GoogleAuthGuard } from '../guard/google-auth.guard';
import { GithubLoginDto } from '../dto/github-login.dto';
import { LinkedInAuthGuard } from '../guard/linked-in-auth.guard';
import { LinkedInLoginDto } from '../dto/linked-in-login.dto';
import { GithubAuthGuard } from '../guard/github-auth.guard';
import { OtpAuthGuard } from '../guard/otp-auth.guard';
import { LoginAsUserDto } from '../dto/login-as-user.dto';
import { RegisterByOauthDto } from '../dto/register-by-oauth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Returns the JWT token' })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    console.log(req);
    return this.authService.login.getLoginToken(req.user);
  }

  @Public()
  @ApiOperation({ summary: 'OTP login' })
  @ApiResponse({ status: 200, description: 'Returns the JWT token' })
  @ApiBody({ type: OtpLoginDto })
  @UseGuards(OtpAuthGuard)
  @Post('otpLogin')
  async otpLogin(@Request() req) {
    return req.user;
  }

  @Public()
  @Post('github')
  @ApiBody({ type: GithubLoginDto })
  @UseGuards(GithubAuthGuard)
  async githubLogin(@Request() req) {
    return req.user;
  }

  @Public()
  @Post('linkedin')
  @ApiBody({ type: LinkedInLoginDto })
  @UseGuards(LinkedInAuthGuard)
  async linkedInLogin(@Request() req) {
    return req.user;
  }

  @Public()
  @Post('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(@Request() req) {
    return req.user;
  }

  @Post('/loginAsUser')
  @ApiOperation({ summary: 'login admin as a user' })
  @ApiBody({ type: LoginAsUserDto })
  @ApiResponse({
    status: 200,
    description: 'Logged in successfully',
    type: LoginAsUserDto,
  })
  async loginAsUser(@Body() data: any, @Request() options): Promise<any> {
    const userCredentials = await this.authService.login.getLoginAsUserToken(
      options,
      data,
    );
    return userCredentials;
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
    @Request() options,
  ): Promise<any> {
    return this.authService.oath.registerByOauth(options, data);
  }
}
