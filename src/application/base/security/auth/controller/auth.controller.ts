import { Controller, Post, UseGuards, Request, Get, Req, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../decorators/ispublic.decorator';
import { LoginDto } from '../dto/login.dto';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { AuthService } from '../service/auth.service';
import { OtpLoginDto } from '../dto/otp-login.dto';
import { OtpAuthGuard } from '../guard/otp-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from '../guard/google-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // constructor(private authService: AuthService) {}
  // @ApiOperation({ summary: 'User login' })
  // @ApiResponse({ status: 200, description: 'Returns the JWT token' })
  // @UseGuards(LocalAuthGuard)
  // @Public()
  // @Post('login')
  // async login(@Body() dto : LoginDto) {
  //   return this.authService.login(dto);
  // }
  // @ApiBearerAuth('token')
  // @ApiOperation({ summary: 'Get user profile' })
  // @ApiResponse({ status: 200, description: 'Returns the user profile' })
  // @ApiBearerAuth() // Requires authentication with a JWT token
  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }

  @Public()
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Returns the JWT token' })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
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
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    // Initiates the Google OAuth2 login flow
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallback(@Req() req, @Res() res) {
    const user = req.user;
    return user;
  }

  

}
