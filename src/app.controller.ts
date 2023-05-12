import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from './application/base/security/auth/local-auth.guard';
import { Public } from './application/base/security/auth/decorators/ispublic.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { ApiBody } from '@nestjs/swagger';
import { AuthService } from './application/base/security/auth/auth.service';
import { LoginDto } from './application/base/security/auth/dto/login.dto';
import { JwtAuthGuard } from './application/base/security/auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, 
    private readonly authService : AuthService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Returns the JWT token' })
  @UseGuards(LocalAuthGuard)
  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Body() dto : LoginDto) {
    return this.authService.login(dto);
  }

  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Returns the user profile' })
  @ApiBearerAuth() // Requires authentication with a JWT token
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

}
