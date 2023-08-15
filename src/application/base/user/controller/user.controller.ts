import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Request,
  Res,
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
import { CreditIncrementDto } from '../dto/credit-increment.dto';
import { UserService } from '../service/user.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResendEmailDto } from '../dto/resend-email.dto';
import { ResetPasswordByPhoneDto } from '../dto/reset-password-by-phone.dto';
import { PostUserCreditDto } from '../dto/post-user-credit.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { Public } from '../../security/auth/decorators/ispublic.decorator';
import { PhoneNumberDto } from '../../security/auth/dto/phoneNumber.dto';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { Response } from 'express';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangeEmailDto } from '../dto/change-email.dto';

@ApiTags('User')
@Controller('users')
@ApiBearerAuth() // Requires authentication with a JWT token
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get('/checkPhoneNumber/:phoneNumber')
  @ApiOperation({ summary: 'check user existance ' })
  @ApiParam({
    name: 'phoneNumber',
    type: String,
    description: 'The phone number to check for user existence.',
    example: '09121121212',
  })
  async checkPhoneNumber(@Param() dto: PhoneNumberDto): Promise<boolean> {
    return await this.userService.checkPhoneNumber(dto.phoneNumber);
  }

  @Put()
  @ApiOperation({ summary: 'update user data' })
  @ApiBody({ type: UpdateUserDto })
  async updateUser(
    @Request() options: SessionRequest,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    const userId = options.user.userId;
    await this.userService.updateUser(userId, updateUserDto);
    return res.status(200).json({ message: 'User updated successfully' });
  }

  @Put('email')
  @ApiOperation({ summary: 'set user email ' })
  @ApiBody({ type: ChangeEmailDto })
  async changeEmail(
    @Request() options: SessionRequest,
    @Body() changeEmailDto: ChangeEmailDto,
    @Res() res: Response,
  ): Promise<Response> {
    const userId = options.user.userId;
    await this.userService.changeEmail(userId, changeEmailDto);
    return res.status(200).json({ message: 'User updated successfully' });
  }

  @Get('email')
  @ApiOperation({ summary: 'get user email ' })
  async getEmail(
    @Request() options: SessionRequest,
  ): Promise<{email: string}> {
    const info = await this.userService.getSingleUserInfo(options);
    return {email: info.email};
  }


  @Put('changePassword')
  @ApiOperation({ summary: 'change password ' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @Request() options: SessionRequest,
    @Body() dto: ChangePasswordDto,
    @Res() res: Response,
  ): Promise<Response> {
    console.log('change pass');
    console.log(options.user);
    const userId = options.user.userId;
    await this.userService.changePassword(userId, dto.password);
    return res.status(200).json({ message: 'Group created successfully' });
  }

  @Post('/credit/increment')
  @ApiOperation({ summary: 'increases user credit' })
  @ApiBody({ type: CreditIncrementDto })
  @ApiCreatedResponse({ description: 'The payment link', type: String })
  async incrementCredit(
    @Body() data: CreditIncrementDto,
    @Request() options: SessionRequest,
  ): Promise<string> {
    const paymentLink = await this.userService.creditIncrement(options, data);
    return paymentLink;
  }

  @Public()
  @Post('/forgot-password')
  @ApiOperation({
    summary: "Sends an email to the user to reset the user's password",
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent successfully',
  })
  async forgotPassword(
    @Body() data: ForgotPasswordDto,
    @Request() options: SessionRequest,
  ): Promise<void> {
    await this.userService.forgotPassword(options, data);
  }

  @Get('/credit')
  @ApiOperation({ summary: 'returns user credit' })
  @ApiOkResponse({ description: "The user's credit", type: Number })
  async getUserCredit(@Request() options: SessionRequest): Promise<number> {
    const userCredit = await this.userService.getUserCredit(options);
    console.log(options.user.userId);
    return userCredit;
  }

  @Post('/credit')
  @ApiOperation({ summary: 'update user credit' })
  @ApiBody({ type: PostUserCreditDto })
  @ApiCreatedResponse({ description: 'User credit updated successfully' })
  async updateUserCredit(
    @Body() body: PostUserCreditDto,
    @Request() options: SessionRequest,
  ): Promise<void> {
    await this.userService.postUserCredit(options, body.credit);
  }

  @Get('/info')
  @ApiOperation({ summary: 'returns single user info' })
  @ApiResponse({
    status: 200,
    description: 'The user information',
    type: Object,
  })
  async getSingleUserInfo(@Request() options: SessionRequest): Promise<any> {
    const userInfo = await this.userService.getSingleUserInfo(options);
    return userInfo;
  }

  @Post('/resend-email')
  @ApiOperation({ summary: 'resend email' })
  @ApiBody({ type: ResendEmailDto })
  @ApiCreatedResponse({ description: 'Email resent successfully' })
  async resendEmail(
    @Body() data: ResendEmailDto,
    @Request() options: SessionRequest,
  ): Promise<void> {
    await this.userService.resendEmail(data, options);
  }

  // @Post('/resetForgottenPassword')
  // @ApiOperation({ summary: `reset user's password` })
  // @ApiBody({ type: ResetForgottenPasswordDto })
  // @ApiOkResponse({ description: 'Password reset successfully' })
  // async resetForgottenPassword(
  //   @Body() data: ResetForgottenPasswordDto,
  //   @Request() options : SessionRequest,
  // ): Promise<void> {
  //   await this.userService.resetForgottenPassword(data, options);
  // }

  @Post('/resetPasswordByPhone')
  @ApiOperation({ summary: 'reset Password By phone number' })
  @ApiBody({ type: ResetPasswordByPhoneDto })
  @ApiOkResponse({ description: 'Password reset successfully' })
  async resetPasswordByPhone(
    @Body() data: ResetPasswordByPhoneDto,
  ): Promise<void> {
    await this.userService.resetPasswordByPhone(data);
  }

  @Post('/credit/increment/:authority/verify')
  @ApiOperation({ summary: `verify user's credit increment` })
  @ApiParam({ name: 'authority', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Credit increment verified successfully',
  })
  async verifyCreditIncrement(
    @Param('authority') authority: string,
    @Request() options: SessionRequest,
  ): Promise<void> {
    await this.userService.verifyCreditIncrement(options, authority);
  }

  @Get('/verify-email/:token')
  @ApiOperation({ summary: 'verify user email' })
  @ApiParam({ name: 'token', type: 'string' })
  async verifyEmail(
    @Param('token') token: string,
    @Request() options: SessionRequest,
  ): Promise<void> {
    await this.userService.verifyEmail(options, token);
  }
}
