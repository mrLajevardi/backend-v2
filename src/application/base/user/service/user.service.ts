import {
  BadRequestException,
  ForbiddenException,
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
import { isEmpty } from 'lodash';
import { PaymentService } from 'src/application/payment/payment.service';
import { NotificationService } from '../../notification/notification.service';
import { InvalidPhoneNumberException } from 'src/infrastructure/exceptions/invalid-phone-number.exception';
import { InvalidEmailTokenException } from 'src/infrastructure/exceptions/invalid-email-token.exception';
import { encryptPassword } from 'src/infrastructure/helpers/helpers';
import { SecurityToolsService } from '../../security/security-tools/security-tools.service';
import { UpdateUserDto } from '../../crud/user-table/dto/update-user.dto';
import { CreateUserDto } from '../../crud/user-table/dto/create-user.dto';
import { SessionRequest } from 'src/infrastructure/types/session-request.type';
import { Like } from 'typeorm';
import { ResendEmailDto } from '../dto/resend-email.dto';
import { ResetPasswordByPhoneDto } from '../dto/reset-password-by-phone.dto';
import { CreditIncrementDto } from '../dto/credit-increment.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ChangeEmailDto } from '../dto/change-email.dto';
import { ResetForgottenPasswordDto } from '../dto/reset-forgotten-password.dto';
import { InvalidPhoneTokenException } from 'src/infrastructure/exceptions/invalid-phone-token.exception';
import { JwtService } from '@nestjs/jwt';
import { MoreThanOneUserWithSameEmail } from 'src/infrastructure/exceptions/more-than-one-user-with-this-email.exception';

@Injectable()
export class UserService {
  constructor(
    private readonly userTable: UserTableService,
    private readonly transactionsTable: TransactionsTableService,
    private readonly roleMappingsTable: RoleMappingTableService,
    private readonly systemSettingsTable: SystemSettingsTableService,
    private readonly logger: LoggerService,
    private readonly paymentService: PaymentService,
    private readonly notificationService: NotificationService,
    private readonly securityTools: SecurityToolsService,
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

  //changing the user email and set email verified to false
  async changeEmail(userId: number, dto: ChangeEmailDto): Promise<void> {
    await this.userTable.update(userId, {
      email: dto.email,
      emailVerified: false,
    });
  }

  async changePassword(userId: number, newPassword: string): Promise<void> {
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

  async checkUserCredit(
    costs: number,
    userId: number,
    options: SessionRequest,
    serviceType: string,
  ): Promise<boolean> {
    try {
      const user = await this.userTable.findById(userId);
      const userCredit = user.credit;
      console.log(costs);
      if (userCredit >= costs) {
        const updatedCredit = userCredit - costs;
        // Implement

        await this.userTable.updateAll(
          { id: userId },
          { credit: updatedCredit },
        );

        // ******

        if (options && serviceType && updatedCredit) {
          //only for lint
        }
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
        // if (updateResult.count < 1) {
        //   return Promise.reject(new Error('not updated'));
        // }
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
      credit: 0,
      emailVerified: false,
      deleted: false,
      email: null,
      password: await encryptPassword(password),
      active: false,
      phoneVerified: true,
      acceptTermsOfService: true,
    };
    console.log(createDto);
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

    await this.roleMappingsTable.create({
      roleId: 'user',
      principalType: 'USER',
      principalId: theUser.id.toString(),
    });

    return theUser;
  }

  async creditIncrement(
    options: SessionRequest,
    data: CreditIncrementDto,
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

    let zarinpalConfig: ZarinpalConfigDto;
    zarinpalConfig.metadata.email = options.user.username;
    zarinpalConfig.metadata.mobile = user.phoneNumber;

    const paymentRequestData = { ...zarinpalConfig, amount };

    const authorityCode = await this.paymentService.zarinpal.paymentRequest(
      paymentRequestData,
    );

    if (authorityCode) {
      const transactionsDto: CreateTransactionsDto = {
        userId: user.id.toString(),
        dateTime: new Date(),
        value: amount,
        invoiceId: null,
        description: 'INC',
        paymentType: 1,
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
    console.log(options.user.userId);
    const user = await this.userTable.findById(options.user.userId);
    return Promise.resolve(user.credit);
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

  async postUserCredit(options: SessionRequest, credit: number): Promise<void> {
    const user = await this.userTable.findById(options.user.userId);
    await this.userTable.updateAll(
      { id: options.user.userId },
      {
        credit: user.credit + credit,
      },
    );
    return;
  }

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

    console.log(verified, transaction.isApproved);
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
      await this.userTable.updateAll(
        {
          id: userId,
        },
        {
          credit: user.credit + transaction.value,
        },
      );
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

  async resetPasswordByPhone(
    data: ResetPasswordByPhoneDto,
  ): Promise<{ hash: string }> {
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
}
