import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from './application/base/auth/guard/local-auth.guard';
import { Public } from './application/base/auth/decorators/ispublic.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from './application/base/auth/auth.service';
import { LoginDto } from './application/base/auth/dto/login.dto';
import { JwtAuthGuard } from './application/base/auth/guard/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, 
    private readonly authService : AuthService) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Returns the JWT token' })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Returns the user profile' })
  @ApiBearerAuth() // Requires authentication with a JWT token
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

}
