import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Request,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { UserTableService } from '../crud/user-table/user-table.service';
import { CreditIncrementDto } from './dto/credit-increment.dto';
import { UserService } from './user.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResendEmailDto } from './dto/resend-email.dto';
import { NotificationService } from '../notification/notification.service';
import { ResetForgottenPasswordDto } from './dto/reset-forgotten-password.dto';
import { ResetPasswordByPhoneDto } from './dto/reset-password-by-phone.dto';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth() // Requires authentication with a JWT token
export class UserController {
  constructor(
    private readonly userTableService: UserTableService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ) { }

  @Post('/credit/increment')
  @ApiOperation({ summary: 'increases user credit' })
  @ApiBody({ type: CreditIncrementDto })
  @ApiCreatedResponse({ description: 'The payment link', type: String })
  async incrementCredit(
    @Body() data: CreditIncrementDto,
    @Request() options
  ): Promise<string> {
    const paymentLink = await this.userService.creditIncrement(options, data);
    return paymentLink;
  }

  @Post('/forgot-password')
  @ApiOperation({ summary: 'Sends an email to the user to reset the user\'s password' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset email sent successfully' })
  async forgotPassword(
    @Body() data: ForgotPasswordDto,
    @Request() options
    ): Promise<void> {
    await this.userService.forgotPassword(options,data);
  }

  @Get('/credit')
  @ApiOperation({ summary: 'returns user credit' })
  @ApiOkResponse({ description: 'The user\'s credit', type: Number })
  async getUserCredit(@Request() options): Promise<number> {
    const userCredit = await this.userService.getUserCredit(options);
    return userCredit;
  }

  @Post('/credit')
  @ApiOperation({ summary: 'update user credit' })
  @ApiBody({ type: Number })
  @ApiCreatedResponse({ description: 'User credit updated successfully' })
  async updateUserCredit(
    @Body() credit: number,
    @Request() options
    ): Promise<void> {
    await this.userService.postUserCredit(options,credit);
  }

  @Get('/info')
  @ApiOperation({ summary: 'returns single user info' })
  @ApiResponse({ status: 200, description: 'The user information', type: Object })
  async getSingleUserInfo(@Request() options): Promise<Object> {
    const userInfo = await this.userService.getSingleUserInfo(options);
    return userInfo;
  }

  @Post('/resend-email')
  @ApiOperation({ summary: 'resend email' })
  @ApiBody({ type: ResendEmailDto })
  @ApiCreatedResponse({ description: 'Email resent successfully' })
  async resendEmail(
    @Body() data: ResendEmailDto,
    @Request() options
    ): Promise<void> {
    await this.userService.resendEmail(data,options);
  }

  @Post('/resetForgottenPassword')
  @ApiOperation({ summary: `reset user's password` })
  @ApiBody({ type: ResetForgottenPasswordDto })
  @ApiOkResponse({ description: 'Password reset successfully' })
  async resetForgottenPassword(
    @Body() data: ResetForgottenPasswordDto,
    @Request() options
    ): Promise<void> {
    await this.userService.resetForgottenPassword(data,options);
  }

  @Post('/resetPasswordByPhone')
  @ApiOperation({ summary: 'reset Password By phone number' })
  @ApiBody({ type: ResetPasswordByPhoneDto })
  @ApiOkResponse({ description: 'Password reset successfully' })
  async resetPasswordByPhone(
    @Body() data: ResetPasswordByPhoneDto,
    @Request() options
    ): Promise<void> {
    await this.userService.resetPasswordByPhone(data, options);
  }

  @Post('/credit/increment/:authority/verify')
  @ApiOperation({ summary: `verify user's credit increment` })
  @ApiParam({ name: 'authority', type: 'string' })
  @ApiResponse({ status: 200, description: 'Credit increment verified successfully' })
  async verifyCreditIncrement(
    @Param('authority') authority: string,
    @Request() options
    ): Promise<void> {
    await this.userService.verifyCreditIncrement(options,authority);
  }

  @Get('/verify-email/:token')
  @ApiOperation({ summary: 'verify user email' })
  @ApiParam({ name: 'token', type: 'string' })
  async verifyEmail(
    @Param('token') token: string,
    @Request() options
    ): Promise<void> {
    await this.userService.verifyEmail(options,token);
  }
  
}
