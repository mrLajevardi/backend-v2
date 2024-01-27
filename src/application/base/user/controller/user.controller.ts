import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Request,
  Res,
  UploadedFile,
  UseInterceptors,
  Req,
  Query,
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
  ApiQuery,
} from '@nestjs/swagger';
import { CreditIncrementDto } from '../dto/credit-increment.dto';
import { UserService } from '../service/user.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResendEmailDto } from '../dto/resend-email.dto';
import { ResetPasswordByPhoneDto } from '../dto/reset-password-by-phone.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { Public } from '../../security/auth/decorators/ispublic.decorator';
import { PhoneNumberDto } from '../../security/auth/dto/phoneNumber.dto';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { Response } from 'express';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangeEmailDto } from '../dto/change-email.dto';
import { ResetForgottenPasswordDto } from '../dto/reset-forgotten-password.dto';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { UserProfileDto } from '../dto/user-profile.dto';
import { LoginService } from '../../security/auth/service/login.service';
import { VerifyOtpDto } from '../../security/auth/dto/verify-otp.dto';
import { SecurityToolsService } from '../../security/security-tools/security-tools.service';
import { ChangePhoneNumberDto } from '../../security/auth/dto/change-phone-number.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RedisCacheService } from '../../../../infrastructure/utils/services/redis-cache.service';
import { ChangeNameDto } from '../dto/change-name.dto';
import {
  ResultDtoCollectionResponse,
  TransactionsResultDto,
} from '../../transactions/dto/results/transactions.result.dto';
import { UserInfoService } from '../service/user-info.service';
import { InvoiceUserList } from '../dto/results/invoice-user-list.result.dto';
import { OtpNotMatchException } from '../../../../infrastructure/exceptions/otp-not-match-exception';
import { Throttle } from '@nestjs/throttler';
import { ServiceTypesEnum } from '../../service/enum/service-types.enum';
import { PhoneNumberHashResultDto } from '../dto/results/phone-number-hash.result.dto';

@ApiTags('User')
@Controller('users')
@ApiBearerAuth() // Requires authentication with a JWT token
// @CheckPolicies((ability: PureAbility, props: PolicyHandlerOptions) =>
//   ability.can(Action.Manage, subject(AclSubjectsEnum.Users, props)),
// )
// @UseGuards(PersonalVerificationGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userInfoService: UserInfoService,
    private readonly loginService: LoginService,
    private readonly securityTools: SecurityToolsService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

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
  ): Promise<{ email: string }> {
    const info = await this.userService.getSingleUserInfo(options);
    return { email: info.email };
  }

  @Get('changePassword/sendOtp')
  @Throttle({ default: { limit: 1, ttl: 120000 } })
  @ApiOperation({ summary: 'send otp to phone number for changing password' })
  async sendOtpChangingPassword(@Request() options: SessionRequest) {
    const user: UserProfileDto = await this.userService.findById(
      options.user.userId,
    );
    const otp = await this.loginService.generateOtp(user.phoneNumber);

    return {
      phoneNumber: user.phoneNumber,
      hash: otp.hash,
    };
  }

  @Post('changePassword/verifyOtp')
  @ApiOperation({
    summary: 'verify otp sent to phone number for changing password',
  })
  async verifyOtpChangingPassword(
    @Request() options: SessionRequest,
    @Body() data: VerifyOtpDto,
  ): Promise<boolean> {
    const verify: boolean = this.securityTools.otp.otpVerifier(
      data.phoneNumber,
      data.otp,
      data.hash,
    );

    if (!verify) {
      throw new OtpNotMatchException();
    }

    const cacheKey: string = options.user.userId + '_changePassword';
    await this.redisCacheService.set(cacheKey, data.phoneNumber, 480000);

    return true;
  }

  @Put('changePassword')
  @ApiOperation({ summary: 'change password for current user ' })
  async changePassword(
    @Request() options: SessionRequest,
    @Body() data: ChangePasswordDto,
  ): Promise<boolean> {
    return await this.userService.changePassword(options.user, data);
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

  @Public()
  @Post('/forgot-password/:token/reset-password')
  @ApiOperation({
    summary: 'resets the password using token emailed to user',
  })
  @ApiBody({ type: ResetForgottenPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
  })
  async resetForgottenPassword(
    @Body() data: ResetForgottenPasswordDto,
    @Request() options: SessionRequest,
  ): Promise<void> {
    await this.userService.resetForgottenPassword(options, data);
  }

  @Get('/credit')
  @ApiOperation({ summary: 'returns user credit' })
  @ApiOkResponse({ description: "The user's credit", type: Number })
  async getUserCredit(@Request() options: SessionRequest): Promise<number> {
    const userCredit = await this.userService.getUserCredit(options);
    console.log(options.user.userId);
    return userCredit;
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

  @Public()
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
  ): Promise<object> {
    const x = await this.userService.verifyCreditIncrement(options, authority);
    return x;
  }

  @Public()
  @Get('/verify-email/:token')
  @ApiOperation({ summary: 'verify user email' })
  @ApiParam({ name: 'token', type: 'string' })
  async verifyEmail(
    @Param('token') token: string,
    @Request() options: SessionRequest,
  ): Promise<void> {
    await this.userService.verifyEmail(options, token);
  }

  @Post('/createProfile')
  @ApiOperation({ summary: 'create user profile' })
  async createProfile(
    @Request() options: SessionRequest,
    @Body() data: CreateProfileDto,
  ): Promise<UserProfileDto> {
    return await this.userService.createProfile(options, data);
  }

  @Get('/profile')
  @ApiOperation({ summary: 'get user profile' })
  async profile(@Request() options: SessionRequest) {
    return await this.userService.getUserProfile(options);
  }

  @Get('/personalVerification')
  @ApiOperation({
    summary: 'personal verification , call external api to verification',
  })
  async personalVerification(
    @Request() options: SessionRequest,
  ): Promise<UserProfileDto> {
    return await this.userService.personalVerification(options);
  }

  @Throttle({ default: { limit: 1, ttl: 120000 } })
  @Get('/changePhoneNumber')
  @ApiOperation({
    summary: 'change current user phone number , send otp to old phone number',
  })
  async changePhoneNumber(@Request() options: SessionRequest) {
    const user: UserProfileDto = await this.userService.findById(
      options.user.userId,
    );
    const otp = await this.loginService.generateOtp(user.phoneNumber);

    return {
      phoneNumber: user.phoneNumber,
      hash: otp.hash,
    };
  }

  @Post('/changePhoneNumber/old-phone/verify-otp')
  @ApiOperation({
    summary: 'verify old phone number otp , send otp to new phone number',
  })
  @ApiResponse({
    type: PhoneNumberHashResultDto,
  })
  async changePhoneNumberOldNumberVerifyOtp(
    @Request() options: SessionRequest,
    @Body() dto: ChangePhoneNumberDto,
  ): Promise<PhoneNumberHashResultDto> {
    return await this.userInfoService.changePhoneNumberOldNumberVerifyOtp(
      options,
      dto,
    );
  }

  @Post('/changePhoneNumber/new-phone/verify-otp')
  @ApiOperation({ summary: 'change current user phone number' })
  async changePhoneNumberVerifyOtp(
    @Request() options: SessionRequest,
    @Body() data: VerifyOtpDto,
  ): Promise<UserProfileDto> {
    return await this.userService.changeUserPhoneNumber(options, data);
  }

  @Post('/insertEmail')
  @ApiOperation({ summary: 'insert or update email , then send otp to email' })
  async insertEmail(
    @Request() options: SessionRequest,
    @Body() data: ChangeEmailDto,
  ) {
    return await this.userService.sendOtpToEmail(options, data);
  }

  @Post('/email/verify-otp')
  @ApiOperation({ summary: 'verify email otp' })
  async verifyEmailOtp(
    @Request() options: SessionRequest,
    @Body() data: VerifyEmailDto,
  ): Promise<boolean> {
    return await this.userService.verifyEmailOtp(options, data);
  }

  @Post('/uploadAvatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'upload avatar profile for user' })
  async uploadAvatar(
    @Request() options: SessionRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userService.uploadAvatar(options, file);
  }

  @Post('/changeName')
  @ApiOperation({ summary: 'change name , family' })
  async changeName(
    @Request() options: SessionRequest,
    @Body() data: ChangeNameDto,
  ) {
    return await this.userService.changeName(options, data);
  }

  @Post('/uploadCompanyLetter')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'upload company letter for introducing the representative',
  })
  async uploadCompanyLetter(
    @Request() options: SessionRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userService.uploadCompanyLetter(options, file);
  }

  @Get('/deleteCompanyLetter')
  @ApiOperation({
    summary: 'delete company letter',
  })
  async deleteCompanyLetter(@Request() options: SessionRequest) {
    return await this.userService.deleteCompanyLetter(options);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get all user transactions' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'pageSize', type: Number, required: false })
  @ApiQuery({ name: 'serviceType', type: String, required: false })
  @ApiQuery({ name: 'value', type: String, required: false })
  @ApiQuery({ name: 'invoiceID', type: String, required: false })
  @ApiQuery({ name: 'ServiceID', type: String, required: false })
  @ApiQuery({ name: 'startDateTime', type: String, required: false })
  @ApiQuery({ name: 'endDateTime', type: String, required: false })
  @ApiOkResponse({ description: 'The array of user transactions', type: Array })
  async getTransactions(
    @Req() options: SessionRequest,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('serviceType') serviceType?: ServiceTypesEnum,
    @Query('invoiceID') invoiceID?: number,
    @Query('ServiceID') ServiceID?: string,
    @Query('startDateTime') startDateTime?: string,
    @Query('endDateTime') endDateTime?: string,
  ): Promise<ResultDtoCollectionResponse> {
    if (!page) {
      page = 1;
    }
    if (!pageSize) {
      pageSize = 10;
    }

    const data = await this.userService.getTransactions(
      options,
      page,
      pageSize,
      serviceType,
      invoiceID,
      ServiceID,
      startDateTime ? new Date(startDateTime) : null,
      endDateTime ? new Date(endDateTime) : null,
    );

    return new TransactionsResultDto().collection(data.transaction, {
      totalRecords: data.totalRecords,
    });
  }

  @Get('invoices')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'pageSize', type: Number, required: false })
  @ApiQuery({ name: 'isPreInvoice', type: Boolean, required: false })
  @ApiQuery({ name: 'startDateTime', type: String, required: false })
  @ApiQuery({ name: 'endDateTime', type: String, required: false })
  async getUserInvoices(
    @Req() options: SessionRequest,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('startDateTime') startDateTime?: string,
    @Query('endDateTime') endDateTime?: string,
    @Query('isPreInvoice') isPreInvoice?: boolean,
  ) {
    const data = await this.userInfoService.getInvoices(
      options,
      page,
      pageSize,
      isPreInvoice,
      startDateTime ? new Date(startDateTime) : null,
      endDateTime ? new Date(endDateTime) : null,
    );

    return new InvoiceUserList().collection(data.data, {
      totalRecords: data.total,
    });
  }
}
