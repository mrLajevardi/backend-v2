import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/infrastructure/database/entities/User';
import * as bcrypt from 'bcrypt';
import { BadRequestError } from 'passport-headerapikey';
import { UserTableService } from '../crud/user-table/user-table.service';
import { ZarinpalConfigDto } from 'src/application/payment/dto/zarinpal-config.dto';
import { ZarinpalService } from 'src/application/payment/zarinpal.service';
import { InvalidPhoneTokenException } from 'src/infrastructure/exceptions/invalid-phone-token.exception';
import { InvalidUsernameException } from 'src/infrastructure/exceptions/invalid-username.exception';
import { UnprocessableEntity } from 'src/infrastructure/exceptions/unprocessable-entity.exception';
import { UserAlreadyExist } from 'src/infrastructure/exceptions/user-already-exist.exception';
import { generatePassword } from 'src/infrastructure/helpers/helpers';
import { RoleMappingTableService } from '../crud/role-mapping-table/role-mapping-table.service';
import { SystemSettingsTableService } from '../crud/system-settings-table/system-settings-table.service';
import { CreateTransactionsDto } from '../crud/transactions-table/dto/create-transactions.dto';
import { TransactionsTableService } from '../crud/transactions-table/transactions-table.service';
import { EmailContentService } from '../notification/email-content.service';
import { EmailService } from '../notification/email.service';
import jwt from 'jsonwebtoken'; 
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { isEmpty } from 'lodash';
import { PaymentService } from 'src/application/payment/payment.service';
import { NotificationService } from '../notification/notification.service';

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
  ) {}

  // find user by phone number
  async findByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    return await this.userTable.findOne({
      where: { phoneNumber: phoneNumber },
    });
  }

  // convery string to password hash
  async getPasswordHash(string: string): Promise<string> {
    if (!string) {
      throw new BadRequestError('bad parameters');
    }
    return await bcrypt.hash(string, 10);
  }

  // compare two passwordes
  async comparePassword(hashed: string, plain: string): Promise<boolean> {
    return await bcrypt.compare(plain, hashed);
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


  async beforeCreateUser(
    context,
    remoteMethodOutput,
    next,
) {
    const phone = jwt.decode(context.args.data.pjwt);
    context.args.data.username = `U-${phone}`;
    context.args.data.vdcPassword = generatePassword();
    context.args.data.name = 'کاربر';
    context.args.data.family = 'گرامی';
    context.args.data.phoneNumber = phone;

    const user = await this.userTable.findOne({
        where: {
            phoneNumber: phone,
        },
    });

    if (user) {
        return Promise.reject(new UserAlreadyExist());
    }
    const pjwtVerified = await jwt.verify(context.args.data.pjwt, process.env.OTP_SECRET_KEY);
    if (!pjwtVerified) {
        return Promise.reject(new InvalidPhoneTokenException);
    }

    context.args.data.active = true;
    context.args.data.phoneVerified = true;
    const filteredContext = {
        ...context.args.data,
        code: null,
        realm: null,
        hasVdc: false,
        emailToken: null,
        credit: 0,
        emailVerified: false,
        deleted: false,
        email: null,
    };

    if (Object.keys(context.args.data).includes('id')) {
        delete context.args.data.id;
    }
    context.args.data = filteredContext;
};

async afterCreateUser(
    context,
    remoteMethodOutput,
    next,
) {
    await this.logger.info(
        'user',
        'register',
        {
            username: remoteMethodOutput.username,
            _object: remoteMethodOutput.id,
        },
        {
            ...context.res.locals,
            userId: remoteMethodOutput.id,
        },
    );
    if (remoteMethodOutput) {
        // add role user
        await this.roleMappingsTable.create({
            roleId: 'user',
            principalType: 'USER',
            principalId: remoteMethodOutput.id,
        });
    }
};


async creditIncrement(
    options,
    data,
) {
    const userId = options.user.id;
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
    if (amount < filteredSettings['credit.minValue'] ||
        amount > filteredSettings['credit.maxValue']) {
        return Promise.reject(new UnprocessableEntity());
    }


    let zarinpalConfig : ZarinpalConfigDto;
    zarinpalConfig.metadata.email = options.locals.username;
    zarinpalConfig.metadata.mobile = user.phoneNumber;

    const paymentRequestData = { ...zarinpalConfig, amount };
    const zarinpalService = new ZarinpalService();

    const authorityCode = await zarinpalService.paymentRequest(
        paymentRequestData,
    );

    if (authorityCode) {
        let transactionsDto: CreateTransactionsDto;
        transactionsDto = {
            userId: user.id.toString(),
            dateTime: new Date(),
            value: amount,
            invoiceId: null,
            description: 'INC',
            paymentType: 1,
            paymentToken: authorityCode,
            isApproved: false,
            serviceInstanceId: null, // added because in main code in loopback was not exist
        }
        await this.transactionsTable.create(transactionsDto);
    }
    return Promise.resolve(
        'https://www.zarinpal.com/pg/StartPay/' + authorityCode,
    );
};


async forgotPassword(Users, options, data) {
    const user = await Users.findOne({
        where: {
            and: [
                { username: data.username },
                { emailVerified: true },
            ],
        },
    });
    if (!isEmpty(user)) {
        const email = user.email;
        const url = process.env.EMAIL_BASE_URL + '/authentication/resetPassword?token=';
        const createLink = await this.notificationService.email.createLink(url, user.id, 'resetPassword');
        const link = url + createLink.token;
        const emailOptions = this.notificationService.emailContents.forgotPassword(link, email);
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
};

async getSingleUserInfo(Users, options) {
    const user = await Users.findById(options.accessToken.userId);

    return Promise.resolve({
        name: user.name,
        family: user.family,
        phoneNumber: user.phoneNumber,
    });
};
async getUserCredit(Users, options) {
    const user = await Users.findById(options.accessToken.userId);
    //console.log(getActiveRemoteMethods(Users));
    return Promise.resolve(user.credit);
};

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



async postUserCredit(Users, options, credit) {
    console.log(options);
    const user = await Users.findById(options.accessToken.userId);
    await Users.updateAll({ id: options.accessToken.userId }, {
        credit: user.credit + credit,
    });
    return;
};



async beforeUpdateUser(context, remoteMethodOutput, next) {
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
    for (const key of Object.keys(context.args.data)) {
        if (forbiddenFields.includes(key)) {
            delete context.args.data[key];
        }
    }
    if (Object.keys(context.args.data).length === 0) {
        return next(new BadRequestException());
    }
    next();
};

async afterUpdateUser(ctx, output, next) {
    return;
};



async verifyCreditIncrement(
    options,
    authority = null,
) {
    const userId = options.user.id;
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
    const zarinpalService = new ZarinpalService();
    const { verified, refID } = await zarinpalService.paymentVerify(
        paymentRequestData,
    );

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
        await this.userTable.updateAll({
            id: userId,
        }, {
            credit: user.credit + transaction.value,
        });
    }

    return Promise.resolve({
        verified: verified,
        refID: refID,
    });
};
}
