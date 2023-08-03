import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from './application/base/security/auth/guard/local-auth.guard';
import { Public } from './application/base/security/auth/decorators/ispublic.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from './application/base/security/auth/service/auth.service';
import { LoginDto } from './application/base/security/auth/dto/login.dto';
import { JwtAuthGuard } from './application/base/security/auth/guard/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
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
