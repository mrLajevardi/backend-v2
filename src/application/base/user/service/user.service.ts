import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from 'src/infrastructure/database/entities/User';
import * as bcrypt from 'bcrypt';
import { BadRequestError } from 'passport-headerapikey';
import { UserTableService } from '../../crud/user-table/user-table.service';
import { ZarinpalConfigDto } from 'src/application/payment/dto/zarinpal-config.dto';
import { InvalidPhoneTokenException } from 'src/infrastructure/exceptions/invalid-phone-token.exception';
import { InvalidUsernameException } from 'src/infrastructure/exceptions/invalid-username.exception';
import { UnprocessableEntity } from 'src/infrastructure/exceptions/unprocessable-entity.exception';
import { UserAlreadyExist } from 'src/infrastructure/exceptions/user-already-exist.exception';
import { RoleMappingTableService } from '../../crud/role-mapping-table/role-mapping-table.service';
import { SystemSettingsTableService } from '../../crud/system-settings-table/system-settings-table.service';
import { CreateTransactionsDto } from '../../crud/transactions-table/dto/create-transactions.dto';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import jwt from 'jsonwebtoken';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { isEmpty } from 'lodash';
import { PaymentService } from 'src/application/payment/payment.service';
import { NotificationService } from '../../notification/notification.service';
import { InvalidPhoneNumberException } from 'src/infrastructure/exceptions/invalid-phone-number.exception';
import { AuthService } from '../../security/auth/service/auth.service';
import { InvalidEmailTokenException } from 'src/infrastructure/exceptions/invalid-email-token.exception';
import * as util from 'util';
import { JwtService } from '@nestjs/jwt';
import {
  encryptPassword,
  generatePassword,
} from 'src/infrastructure/helpers/helpers';
import { SecurityToolsService } from '../../security/security-tools/security-tools.service';
import { UpdateUserDto } from '../../crud/user-table/dto/update-user.dto';

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
    private readonly jwtService: JwtService,
  ) {}

  // find user by phone number
  async findByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    return await this.userTable.findOne({
      where: { phoneNumber: phoneNumber },
    });
  }

  async changePassword(userId: number, newPassword: string) {
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

  async checkUserCredit(costs, userId, options, serviceType) {
    try {
      const user = await this.userTable.findById(userId);
      const userCredit = user.credit;
      console.log(costs);
      if (userCredit >= costs) {
        const updatedCredit = userCredit - costs;
        // Implement

        const updateResult = await this.userTable.updateAll(
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
          { ...options.locals },
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

  async createUserByPhoneNumber(phoneNumber: string, password: string ) {
    const theUser = await this.userTable.create({
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
    });

    await this.logger.info(
      'user',
      'register',
      {
        username: theUser.username,
        _object: theUser.id,
      },
      {
        userId: theUser.id,
      },
    );

    await this.roleMappingsTable.create({
      roleId: 'user',
      principalType: 'USER',
      principalId: theUser.id.toString(),
    });

    return theUser;
  }

  async creditIncrement(options, data) {
    const userId = options.user.userId;
    const user = await this.userTable.findById(userId);
    const settings = await this.systemSettingsTable.find({
      where: {
        PropertyKey: { like: '%credit.%' },
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
    zarinpalConfig.metadata.email = options.locals.username;
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

  async forgotPassword(options, data) {
    const user = await this.userTable.findOne({
      where: {
        username: data.username,
        emailVerified: true,
      },
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
      const emailOptions =
        this.notificationService.emailContents.forgotPassword(link, email);
      await this.notificationService.email.sendMail(emailOptions);
      await this.logger.info(
        'user',
        'forgotPasswordLink',
        {
          username: user.username,
          _object: user.id,
        },
        { ...options.locals },
      );
    } else {
      const err = new InvalidUsernameException();
      return Promise.reject(err);
    }
  }

  async getSingleUserInfo(options) {
    const user = await this.userTable.findById(options.user.userId);
    return Promise.resolve({
      name: user.name,
      family: user.family,
      phoneNumber: user.phoneNumber,
    });
  }

  async getUserCredit(options) {
    console.log(options.user.userId);
    const user = await this.userTable.findById(options.user.userId);
    return Promise.resolve(user.credit);
  }

  getActiveRemoteMethods(model) {
    const activeRemoteMethods = model.sharedClass
      .methods({ includeDisabled: false })
      .reduce((result, sharedMethod) => {
        Object.assign(result, {
          [sharedMethod.name]: sharedMethod.isStatic,
        });
        return result;
      }, {});

    return activeRemoteMethods;
  }

  async postUserCredit(options, credit) {
    const user = await this.userTable.findById(options.user.userId);
    await this.userTable.updateAll(
      { id: options.user.userId },
      {
        credit: user.credit + credit,
      },
    );
    return;
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
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
      'credit',
      'email',
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

  async verifyCreditIncrement(options, authority = null) {
    const userId = options.user.userId;
    const user = await this.userTable.findById(userId);
    // find user transaction
    const transaction = await this.transactionsTable.findOne({
      where: {
        and: [{ PaymentToken: authority }, { UserID: userId }],
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

  async resendEmail(data, options) {
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
            ...options.locals,
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

  async resetForgottenPassword(data, options) {
    const pjwtVerified = await jwt.verify(
      data.pjwt,
      process.env.OTP_SECRET_KEY,
    );
    if (!pjwtVerified) {
      return Promise.reject(new InvalidPhoneNumberException());
    }
    const phone = jwt.decode(data.pjwt);
    const user = await this.userTable.findOne({
      where: {
        phoneNumber: phone,
      },
    });
    await this.userTable.updateAll(
      { id: user.id },
      { password: await encryptPassword(data.password) },
    );
    await this.logger.info(
      'user',
      'resetPassword',
      {
        username: user.username,
        _object: user.id,
      },
      { ...options.locals },
    );
    return Promise.resolve({ passwordChanged: true });
  }

  async resetPasswordByPhone(data, options) {
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

  async verifyEmail(token, options) {
    const verifyToken = util.promisify(jwt.verify);
    const parsedToken = null;
    try {
      const parsedToken = this.jwtService.verify(token, {
        subject: 'emailVerification',
      });
    } catch (err) {
      console.log(err);
      return Promise.reject(new InvalidEmailTokenException());
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
        _object: user.id,
      },
      { ...options.locals },
    );
  }
}
