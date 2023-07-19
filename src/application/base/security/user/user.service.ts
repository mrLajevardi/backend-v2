import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import jwt from 'jsonwebtoken';
import { generatePassword } from 'src/infrastructure/helpers/helpers';
import { UserTableService } from '../../crud/user-table/user-table.service';
import { TransactionsTableService } from '../../crud/transactions-table/transactions-table.service';
import { RoleMappingTableService } from '../../crud/role-mapping-table/role-mapping-table.service';
import { SystemSettingsTableService } from '../../crud/system-settings-table/system-settings-table.service';
import { CreateTransactionsDto } from '../../crud/transactions-table/dto/create-transactions.dto';
import { UserAlreadyExist } from 'src/infrastructure/exceptions/user-already-exist.exception';
import { InvalidPhoneTokenException } from 'src/infrastructure/exceptions/invalid-phone-token.exception';
import { UnprocessableEntity } from 'src/infrastructure/exceptions/unprocessable-entity.exception';
import { isEmpty } from 'lodash';
import { InvalidUsernameException } from 'src/infrastructure/exceptions/invalid-username.exception';
import { BadRequestException } from 'src/infrastructure/exceptions/bad-request.exception';
import { ForbiddenException } from 'src/infrastructure/exceptions/forbidden.exception';
import { ZarinpalService } from 'src/application/payment/zarinpal.service';
import { ZarinpalConfigDto } from 'src/application/payment/dto/zarinpal-config.dto';
import { EmailService } from '../../notification/email.service';
import { EmailContentService } from '../../notification/email-content.service';

@Injectable()
export class UserService {

    constructor(
        private readonly userTable: UserTableService,
        private readonly transactionsTable: TransactionsTableService,
        private readonly roleMappingsTable: RoleMappingTableService,
        private readonly systemSettingsTable: SystemSettingsTableService,
        private readonly logger: LoggerService,
        private readonly zarinpalService: ZarinpalService,
        private readonly emailService: EmailService,
        private readonly emailContentService: EmailContentService,
    ) { }

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
            const createLink = await this.emailService.createLink(url, user.id, 'resetPassword');
            const link = url + createLink.token;
            const emailOptions = this.emailContentService.forgotPassword(link, email);
            await this.emailService.sendMail(emailOptions);
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
