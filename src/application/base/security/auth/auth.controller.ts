import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Returns the JWT token' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
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
