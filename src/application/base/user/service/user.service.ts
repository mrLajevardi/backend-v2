import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { User } from 'src/infrastructure/database/entities/User';
import { UserTableService } from '../../crud/user-table/user-table.service';
import { ZarinpalConfigDto } from 'src/application/payment/dto/zarinpal-config.dto';
import { InvalidUsernameException } from 'src/infrastructure/exceptions/invalid-username.exception';
import { UnprocessableEntity } from 'src/infrastructure/exceptions/unprocessable-entity.exception';
import { RoleMappingTableService } from '../../crud/role-mapping-table/role-mapping-table.service';
import { SystemSettingsTableService } from '../../crud/system-settings-table/system-settings-table.service';
import { CreateTransactionsDto } from '../../crud/transactions-table/dto/create-transactions.dto';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { isEmpty, isNil } from 'lodash';
import { PaymentService } from 'src/application/payment/payment.service';
import { NotificationService } from '../../notification/notification.service';
import { InvalidPhoneNumberException } from 'src/infrastructure/exceptions/invalid-phone-number.exception';
import { InvalidEmailTokenException } from 'src/infrastructure/exceptions/invalid-email-token.exception';
import {
  comparePassword,
  encryptPassword,
} from 'src/infrastructure/helpers/helpers';
import { SecurityToolsService } from '../../security/security-tools/security-tools.service';
import { UpdateUserDto } from '../../crud/user-table/dto/update-user.dto';
import { CreateUserDto } from '../../crud/user-table/dto/create-user.dto';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { Connection, FindOptionsWhere, ILike, Like } from 'typeorm';
import { ResendEmailDto } from '../dto/resend-email.dto';
import { ResetPasswordByPhoneDto } from '../dto/reset-password-by-phone.dto';
import { CreditIncrementDto } from '../dto/credit-increment.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ChangeEmailDto } from '../dto/change-email.dto';
import { ResetForgottenPasswordDto } from '../dto/reset-forgotten-password.dto';
import { InvalidPhoneTokenException } from 'src/infrastructure/exceptions/invalid-phone-token.exception';
import { JwtService } from '@nestjs/jwt';
import { MoreThanOneUserWithSameEmail } from 'src/infrastructure/exceptions/more-than-one-user-with-this-email.exception';
import * as process from 'process';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { CompanyTableService } from '../../crud/company-table/company-table.service';
import { CreateCompanyDto } from '../../crud/company-table/dto/create-company.dto';
import { Company } from '../../../../infrastructure/database/entities/Company';
import { plainToClass } from 'class-transformer';
import { UserProfileDto } from '../dto/user-profile.dto';
import { VerifyOtpDto } from '../../security/auth/dto/verify-otp.dto';
import { OtpErrorException } from '../../../../infrastructure/exceptions/otp-error-exception';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import {
  UserProfileResultDto,
  UserProfileResultDtoFormat,
} from '../dto/user-profile.result.dto';
import { RedisCacheService } from '../../../../infrastructure/utils/services/redis-cache.service';
import { ChangeNameDto } from '../dto/change-name.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { CompanyLetterStatusEnum } from '../enum/company-letter-status.enum';
import { TransactionsReturnDto } from '../../service/dto/return/transactions-return.dto';
import { Transactions } from '../../../../infrastructure/database/entities/Transactions';
import { FileTableService } from '../../crud/file-table/file-table.service';
import { UserAlreadyExist } from '../../../../infrastructure/exceptions/user-already-exist.exception';
import { PaymentTypes } from '../../crud/transactions-table/enum/payment-types.enum';
import { UserInfoService } from './user-info.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { UsersFactoryService } from './user.factory.service';
import { UserPayload } from '../../security/auth/dto/user-payload.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userTable: UserTableService,
    private readonly companyTable: CompanyTableService,
    private readonly transactionsTable: TransactionsTableService,
    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionsService: TransactionsService,
    private readonly roleMappingsTable: RoleMappingTableService,
    private readonly systemSettingsTable: SystemSettingsTableService,
    private readonly logger: LoggerService,
    private readonly paymentService: PaymentService,
    private readonly notificationService: NotificationService,
    private readonly securityTools: SecurityToolsService,
    private readonly connection: Connection,
    private readonly redisCacheService: RedisCacheService,
    private readonly fileTableService: FileTableService,
    private readonly userInfoService: UserInfoService,
    private readonly userFactoryService: UsersFactoryService,
  ) {}

  async checkPhoneNumber(phoneNumber: string): Promise<boolean> {
    console.log(phoneNumber);
    const user = await this.findByPhoneNumber(phoneNumber);
    return !isEmpty(user);
  }

  // find user by phone number
  async findByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    return await this.userTable.findOne({
      where: { phoneNumber: phoneNumber },
    });
  }

  async findById(userId: number): Promise<User> {
    return await this.userTable.findById(userId);
  }

  //changing the user email and set email verified to false
  async changeEmail(userId: number, dto: ChangeEmailDto): Promise<void> {
    await this.userTable.update(userId, {
      email: dto.email,
      emailVerified: false,
    });
  }

  async changePasswordAdmin(
    userId: number,
    newPassword: string,
  ): Promise<void> {
    if (!newPassword) {
      return Promise.reject(new BadRequestException());
    }
    const hashedPassword = await encryptPassword(newPassword);
    console.log(userId, hashedPassword);
    await this.userTable.updateAll(
      { id: userId },
      { password: hashedPassword },
    );
  }

  async changePassword(
    userPayload: UserPayload,
    data: ChangePasswordDto,
  ): Promise<boolean> {
    if (data.otpVerification) {
      const cacheKey = userPayload.userId + '_changePassword';
      const checkCache = await this.redisCacheService.exist(cacheKey);
      if (!checkCache) {
        throw new ForbiddenException();
      }
    } else {
      const user: User = await this.userTable.findById(userPayload.userId);
      const isValid = await comparePassword(user.password, data.oldPassword);
      if (!isValid) {
        throw new ForbiddenException();
      }
    }

    const hashedPassword = await encryptPassword(data.newPassword);

    await this.userTable.update(userPayload.userId, {
      password: hashedPassword,
    });

    return Promise.resolve(true);
  }

  async checkUserCredit(
    costs: number,
    userId: number,
    options: SessionRequest,
    serviceType: string,
  ): Promise<boolean> {
    try {
      const userCredit = await this.userInfoService.getUserCreditBy(userId);

      if (userCredit >= costs) {
        await this.transactionsService.create(
          userId,
          PaymentTypes.PayByCredit,
          -costs,
        );

        await this.logger.info(
          'services',
          'buyService',
          {
            costs,
            serviceType,
            _object: userId,
          },
          { ...options.user },
        );

        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async createUserByPhoneNumber(
    phoneNumber: string,
    password: string,
  ): Promise<User> {
    const createDto: CreateUserDto = {
      phoneNumber: phoneNumber,
      username: `U-${phoneNumber}`,
      vdcPassword: password,
      name: 'کاربر',
      family: 'گرامی',
      code: null,
      realm: null,
      hasVdc: false,
      emailToken: null,
      emailVerified: false,
      deleted: false,
      email: null,
      password: await encryptPassword(password),
      active: false,
      phoneVerified: true,
      acceptTermsOfService: true,
    };

    const theUser = await this.userTable.create(createDto);

    await this.logger.info(
      'user',
      'register',
      {
        username: theUser.username,
        _object: theUser.id.toString(),
      },
      {
        userId: theUser.id.toString(),
      },
    );

    // await this.roleMappingsTable.create({
    //   roleId: 'user',
    //   principalType: 'USER',
    //   principalId: theUser.id.toString(),
    // });

    return theUser;
  }

  async creditIncrement(
    options: SessionRequest,
    data: CreditIncrementDto,
    invoiceId: number | null = null,
  ): Promise<string> {
    const userId = options.user.userId;
    const user = await this.userTable.findById(userId);
    const settings = await this.systemSettingsTable.find({
      where: {
        propertyKey: Like('%credit.%'),
      },
    });
    const filteredSettings = {};
    settings.forEach((setting) => {
      filteredSettings[setting.propertyKey] = setting.value;
    });
    console.log(filteredSettings);
    const { amount } = data;
    if (
      amount < filteredSettings['credit.minValue'] ||
      amount > filteredSettings['credit.maxValue']
    ) {
      return Promise.reject(new UnprocessableEntity());
    }

    const zarinpalConfig: ZarinpalConfigDto = {
      email: user.email,
      mobile: user.phoneNumber,
      callback_url: process.env.ZARINPAL_CALLBACK_URL,
      description: process.env.ZARINPAL_DESCRIPTION,
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
    };
    // zarinpalConfig.metadata.email = user.email;
    // zarinpalConfig.metadata.mobile = user.phoneNumber;

    const paymentRequestData = { ...zarinpalConfig, amount };

    const authorityCode = await this.paymentService.zarinpal.paymentRequest(
      paymentRequestData,
    );
    if (authorityCode) {
      const transactionsDto: CreateTransactionsDto = {
        userId: user.id.toString(),
        dateTime: new Date(),
        value: amount,
        invoiceId,
        description: 'INC',
        paymentType: PaymentTypes.PayByZarinpal,
        paymentToken: authorityCode,
        isApproved: false,
        serviceInstanceId: null, // added because in main code in loopback was not exist
      };
      await this.transactionsTable.create(transactionsDto);
    }
    return Promise.resolve(
      'https://www.zarinpal.com/pg/StartPay/' + authorityCode,
    );
  }

  async forgotPassword(
    options: SessionRequest,
    data: ForgotPasswordDto,
  ): Promise<void> {
    const where = {
      email: data.email,
      emailVerified: true,
    };
    const count = await this.userTable.count({ where: where });
    if (count > 1) {
      throw new MoreThanOneUserWithSameEmail();
    }
    const user = await this.userTable.findOne({
      where: where,
    });
    if (!isEmpty(user)) {
      const email = user.email;
      const url =
        process.env.EMAIL_BASE_URL + '/authentication/resetPassword?token=';
      const createLink = await this.notificationService.email.createLink(
        url,
        user.id,
        'resetPassword',
      );
      const link = url + createLink.token;
      console.log(link);
      const emailOptions =
        this.notificationService.emailContents.forgotPassword(link, email);
      await this.notificationService.email.sendMail(emailOptions);
      await this.logger.info(
        'user',
        'forgotPasswordLink',
        {
          username: user.username,
          _object: user.id.toString(),
        },
        { ...options.user },
      );
    } else {
      const err = new InvalidUsernameException();
      return Promise.reject(err);
    }
  }

  async resetForgottenPassword(
    options: SessionRequest,
    data: ResetForgottenPasswordDto,
  ) {
    const secretKey = process.env.EMAIL_JWT_SECRET;
    const jwtService = new JwtService({ secret: secretKey });
    const pjwtVerified = jwtService.verify(data.token);
    if (!pjwtVerified) {
      return Promise.reject(new InvalidPhoneTokenException());
    }
    const dto = jwtService.decode(data.token);
    if (!dto) {
      throw new InvalidEmailTokenException();
    }
    console.log(dto);
    const user = await this.userTable.findById(dto['id']);
    const updated = await this.userTable.updateAll(
      { id: user.id },
      { password: await encryptPassword(data.newPassword) },
    );
    console.log(
      user,
      data.newPassword,
      await encryptPassword(data.newPassword),
    );
    await this.logger.info(
      'user',
      'resetPassword',
      {
        username: user.username,
        _object: user.id.toString(),
      },
      { ...options.user },
    );
    return Promise.resolve({ passwordChanged: true });
  }

  async getSingleUserInfo(options: SessionRequest): Promise<{
    name: string;
    family: string;
    phoneNumber: string;
    email: string;
  }> {
    const user = await this.userTable.findById(options.user.userId);
    return Promise.resolve({
      name: user.name,
      family: user.family,
      phoneNumber: user.phoneNumber,
      email: user.email,
    });
  }

  async getUserCredit(options: SessionRequest): Promise<number> {
    const userCredit = await this.userInfoService.getUserCreditBy(
      options.user.userId,
    );

    return Promise.resolve(userCredit);
  }

  // getActiveRemoteMethods(model) {
  //   const activeRemoteMethods = model.sharedClass
  //     .methods({ includeDisabled: false })
  //     .reduce((result, sharedMethod) => {
  //       Object.assign(result, {
  //         [sharedMethod.name]: sharedMethod.isStatic,
  //       });
  //       return result;
  //     }, {});

  //   return activeRemoteMethods;
  // }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User | Error> {
    const forbiddenFields = [
      'active',
      'emailVerified',
      'username',
      'realm',
      'vdcPassword',
      'deleted',
      'emailToken',
      'code',
      'hasVdc',
      'id',
    ];
    for (const key of Object.keys(updateUserDto)) {
      if (forbiddenFields.includes(key)) {
        delete updateUserDto[key];
      }
    }
    if (Object.keys(updateUserDto).length === 0) {
      return new BadRequestException();
    }

    return this.userTable.update(userId, updateUserDto);
  }

  async verifyCreditIncrement(
    options: SessionRequest,
    authority: string = null,
  ): Promise<{
    verified: boolean;
    refID: string;
  }> {
    const userId = options.user.userId;
    const user = await this.userTable.findById(userId);
    // find user transaction
    const transaction = await this.transactionsTable.findOne({
      where: {
        paymentToken: authority,
        userId: userId,
      },
    });

    if (transaction === null) {
      return Promise.reject(new ForbiddenException());
    }
    const paymentRequestData = {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount: transaction.value,
      authority: authority,
    };
    const { verified, refID } =
      await this.paymentService.zarinpal.paymentVerify(paymentRequestData);

    if (verified && !transaction.isApproved) {
      // approve user transaction
      await this.transactionsTable.updateAll(
        {
          userId: userId,
          paymentToken: authority,
        },
        {
          isApproved: true,
        },
      );
    }
    if (transaction.invoiceId) {
      this.userFactoryService
        .runServiceBasedOnInvoice(transaction.invoiceId, options)
        .catch(console.log);
    }
    return Promise.resolve({
      verified: verified,
      refID: refID,
    });
  }

  async resendEmail(
    data: ResendEmailDto,
    options: SessionRequest,
  ): Promise<void> {
    try {
      const email = data.email;
      const user = await this.userTable.findOne({
        where: { email: email, emailVerified: false },
      });
      if (user) {
        const url =
          process.env.EMAIL_BASE_URL + '/authentication/verify-email/';
        const createLink = await this.notificationService.email.createLink(
          url,
          user.id,
          'emailVerification',
        );
        const link = createLink.link;
        // const token = createLink.token;
        // await Users.updateAll({email: email}, {emailToken: token} );
        const emailOptions =
          this.notificationService.emailContents.userVerification(link, email);
        await this.notificationService.email.sendMail(emailOptions);
        await this.logger.info(
          'user',
          'emailVerification',
          {
            username: email,
            _object: email,
          },
          {
            ...options.user,
          },
        );
      } else {
        const err = new ForbiddenException();
        return Promise.reject(err);
      }
    } catch (err) {
      this.logger.error({
        message: err.message,
        stackTrace: err.stack,
        userId: null,
      });
    }
  }

  async resetPasswordByPhone(data: ResetPasswordByPhoneDto): Promise<{
    hash: string;
  }> {
    const user = await this.userTable.findOne({
      where: {
        phoneNumber: data.phoneNumber,
      },
    });
    if (!data.phoneNumber) {
      return Promise.reject(new InvalidPhoneNumberException());
    }
    if (data.phoneNumber) {
      const phoneRegex = new RegExp('^(\\+98|0)?9\\d{9}$');
      if (!phoneRegex.test(data.phoneNumber)) {
        return Promise.reject(new InvalidPhoneNumberException());
      }
    }
    let hash = null;
    if (user) {
      const otpGenerated = this.securityTools.otp.otpGenerator(
        data.phoneNumber,
      );
      await this.notificationService.sms.sendSMS(
        data.phoneNumber,
        otpGenerated.otp,
      );
      hash = otpGenerated.hash;
    }
    return Promise.resolve({ hash });
  }

  async verifyEmail(options: SessionRequest, token: string): Promise<void> {
    try {
      const jwtService = new JwtService({
        secret: process.env.EMAIL_JWT_SECRET,
      });
      const parsedToken = jwtService.verify(token, {
        subject: 'emailVerification',
      });

      if (!jwtService.verify(token)) {
        throw new InvalidEmailTokenException();
      }
      const user = await this.userTable.findById(parsedToken.id);
      await this.userTable.updateAll(
        { id: parsedToken.id },
        { emailVerified: true },
      );
      await this.logger.info(
        'user',
        'verifyEmail',
        {
          username: user.username,
          _object: user.id.toString(),
        },
        { ...options.user },
      );
    } catch (err) {
      console.log(err);
      return Promise.reject(new InvalidEmailTokenException());
    }
  }

  async createProfile(
    options: SessionRequest,
    data: CreateProfileDto,
  ): Promise<UserProfileDto> {
    const userProfileData: UpdateUserDto = {
      name: data.name,
      family: data.family,
      personalCode: data.personalCode,
      companyOwner: data.companyOwner,
      birthDate: data.birthDate,
      personalVerification: true,
    };

    if (!data.personality) {
      const company: Company = await this.companyTable.create(
        plainToClass(CreateCompanyDto, data, { excludeExtraneousValues: true }),
      );
      userProfileData.companyId = company.id;
    }

    // verify user with api and change personalVerification to true

    await this.userTable.update(options.user.userId, userProfileData);

    const userWithRelation = await this.userTable.findOne({
      where: { id: options.user.userId },
      relations: ['company'],
    });

    return new UserProfileResultDto().toArray(userWithRelation);
  }

  async getUserProfile(options: SessionRequest) {
    // const user = await this.userTable.findOne(options.user.userId);
    const user = await this.userTable.findOne({
      where: { id: options.user.userId },
      relations: [
        'company',
        'company.province',
        'company.city',
        'company.companyLogo',
        'avatar',
        'companyLetter',
      ],
    });

    return new UserProfileResultDto().toArray(user);
  }

  async changeUserPhoneNumber(
    options: SessionRequest,
    data: VerifyOtpDto,
  ): Promise<UserProfileDto> {
    const verify: boolean = this.securityTools.otp.otpVerifier(
      data.phoneNumber,
      data.otp,
      data.hash,
    );

    const cacheKey = options.user.userId + '_changePhoneNumber';
    const checkCache = await this.redisCacheService.exist(cacheKey);

    if (!verify || !checkCache) {
      throw new OtpErrorException();
    }

    const checkUser = await this.userTable.findOne({
      where: {
        phoneNumber: data.phoneNumber,
      },
    });

    if (!isNil(checkUser)) {
      throw new UserAlreadyExist();
    }

    const userUpdatingData: UpdateUserDto = {
      phoneNumber: data.phoneNumber,
      username: 'U-' + data.phoneNumber,
    };

    // Update User in Cloud Director
    //Disable
    //Delete
    //ReCreate

    const updatedUser = await this.userTable.update(
      options.user.userId,
      userUpdatingData,
    );

    return new UserProfileResultDto().toArray(updatedUser);
  }

  async personalVerification(options: SessionRequest) {
    const userProfileData: UpdateUserDto = {
      personalVerification: true,
    };

    const updatedUser = await this.userTable.update(
      options.user.userId,
      userProfileData,
    );
    const user = await this.userTable.findOne({
      where: { id: options.user.userId },
      relations: ['company'],
    });

    return new UserProfileResultDto().toArray(updatedUser);
  }

  async sendOtpToEmail(
    options: SessionRequest,
    data: ChangeEmailDto,
  ): Promise<any> {
    const otpGenerated = this.securityTools.otp.otpGenerator(data.email);
    if (!otpGenerated) {
      throw new OtpErrorException();
    }

    const mailContent =
      this.notificationService.emailContents.emailVerification(
        otpGenerated.otp,
        data.email,
      );
    const mail = this.notificationService.email.sendMail(mailContent);

    return { email: data.email, hash: otpGenerated.hash };
  }

  async verifyEmailOtp(
    options: SessionRequest,
    data: VerifyEmailDto,
  ): Promise<boolean> {
    const otpVerification = this.securityTools.otp.otpVerifier(
      data.email,
      data.otp,
      data.hash,
    );

    if (!otpVerification) {
      return false;
    }

    const userUpdatingData: UpdateUserDto = {
      email: data.email,
      emailVerified: true,
    };

    const user = await this.userTable.update(
      options.user.userId,
      userUpdatingData,
    );

    return true;
  }

  async uploadAvatar(
    options: SessionRequest,
    file: Express.Multer.File,
  ): Promise<UserProfileResultDtoFormat> {
    const fileStream = file.buffer;
    const fileName = Date.now().toString() + file.originalname;

    const avatar = await this.connection
      .createQueryBuilder()
      .insert()
      .into('FileUpload')
      .values({ fileStream: fileStream, name: fileName })
      .returning('Inserted.stream_id')
      .execute();

    console.log(
      '\n\n\n\n file: \n\n',
      avatar,
      '\n\n\n\n name: \n\n',
      avatar.raw[0].stream_id,
    );
    const updateUserData: UpdateUserDto = {
      avatarId: avatar.raw[0].stream_id,
    };

    const updatedUser: User = await this.userTable.update(
      options.user.userId,
      updateUserData,
    );

    const user: User = await this.userTable.findOne({
      where: { id: options.user.userId },
      relations: ['company', 'avatar'],
    });

    console.log('\n\n\n\n\n\n\n', user);

    return new UserProfileResultDto().toArray(user);
  }

  async changeName(options: SessionRequest, data: ChangeNameDto) {
    const userUpdatingData: UpdateUserDto = {
      name: data.name,
      family: data.family,
    };

    const user = await this.userTable.update(
      options.user.userId,
      userUpdatingData,
    );

    return new UserProfileResultDto().toArray(user);
  }

  async uploadCompanyLetter(
    options: SessionRequest,
    file: Express.Multer.File,
  ): Promise<UserProfileResultDtoFormat> {
    const checkUserCompany: User = await this.userTable.findById(
      options.user.userId,
    );

    if (isNil(checkUserCompany.companyId)) {
      throw new BadRequestException();
    }

    const fileStream = file.buffer;
    const fileName = Date.now().toString() + file.originalname;

    const letter = await this.connection
      .createQueryBuilder()
      .insert()
      .into('FileUpload')
      .values({ fileStream: fileStream, name: fileName })
      .returning('Inserted.stream_id')
      .execute();

    const updateUserData: UpdateUserDto = {
      companyLetterId: letter.raw[0].stream_id,
      companyLetterStatus: CompanyLetterStatusEnum.Uploaded,
    };

    await this.userTable.update(options.user.userId, updateUserData);

    const user: User = await this.userTable.findOne({
      where: { id: options.user.userId },
      relations: ['company', 'avatar', 'companyLetter'],
    });

    return new UserProfileResultDto().toArray(user);
  }

  async deleteCompanyLetter(options: SessionRequest): Promise<boolean> {
    const user = await this.userTable.findById(options.user.userId);

    await this.userTable.update(options.user.userId, {
      companyLetterId: null,
      companyLetterStatus: null,
    });

    const file = this.fileTableService.delete(user.companyLetterId);

    return true;
  }
  async getTransactions(
    options: SessionRequest,
    page: number,
    pageSize: number,
    serviceType: string,
    value: number,
    invoiceID: number,
    ServiceID: string,
    startDateTime: Date,
    endDateTime: Date,
  ): Promise<{ transaction: TransactionsReturnDto[]; totalRecords: number }> {
    if (pageSize > 128) {
      return Promise.reject(new BadRequestException());
    }
    if (startDateTime && !endDateTime) {
      endDateTime = new Date();
    }

    let where: FindOptionsWhere<Transactions> = {};
    if (
      isNil(
        serviceType ||
          value ||
          invoiceID ||
          ServiceID ||
          startDateTime ||
          endDateTime,
      )
    ) {
      where = {
        userId: options.user.userId,
      };
    } else {
      where = {
        invoiceId: invoiceID,
        userId: options.user.userId,
        serviceInstanceId: ServiceID,
        value: value,
        description: ILike(`%${serviceType}%`),
      };
    }
    if (startDateTime && endDateTime) {
      where['DateTime'] = { $between: [startDateTime, endDateTime] };
    }

    const transaction = await this.transactionsTable.find({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where,
      order: {
        dateTime: 'DESC',
      },
      relations: ['invoice', 'serviceInstance', 'user'],
    });
    const withoutPagination = await this.transactionsTable.find({
      where,
    });

    const totalRecords = withoutPagination.length;
    const data = { transaction: transaction, totalRecords };
    if (!transaction) {
      return Promise.reject(new ForbiddenException());
    }

    return data;
  }
}
