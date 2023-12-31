import { Test, TestingModule } from '@nestjs/testing';
import { TwoFactorAuthController } from './two-factor-auth.controller';
import { DatabaseModule } from '../../../../../infrastructure/database/database.module';
import { PassportModule } from '@nestjs/passport';
import { CrudModule } from '../../../crud/crud.module';
import { UserTableModule } from '../../../crud/user-table/user-table.module';
import { UserModule } from '../../../user/user.module';
import { TransactionsModule } from '../../../transactions/transactions.module';
import { NotificationModule } from '../../../notification/notification.module';
import { PaymentModule } from '../../../../payment/payment.module';
import { LoggerModule } from '../../../../../infrastructure/logger/logger.module';
import { SecurityToolsModule } from '../../security-tools/security-tools.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from '../service/auth.service';
import { UserService } from '../../../user/service/user.service';
import { UserTableService } from '../../../crud/user-table/user-table.service';
import { OauthService } from '../service/oauth.service';
import { OtpService } from '../../security-tools/otp.service';
import { LoginService } from '../service/login.service';
import { TwoFaAuthService } from '../service/two-fa-auth.service';
import { TwoFaAuthStrategy } from '../classes/two-fa-auth.strategy';
import { TwoFaAuthTypeService } from '../classes/two-fa-auth-type.service';
import { TwoFaAuthSmsService } from '../classes/two-fa-auth-sms.service';
import { TwoFaAuthEmailService } from '../classes/two-fa-auth-email.service';

describe('TwoFactorAuthController', () => {
  let controller: TwoFactorAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        PassportModule,
        CrudModule,
        UserTableModule,
        UserModule,
        TransactionsModule,
        NotificationModule,
        PaymentModule,
        LoggerModule,
        SecurityToolsModule,
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1800s' },
        }),
      ],
      controllers: [TwoFactorAuthController],
      providers: [
        AuthService,
        UserService,
        JwtService,
        UserTableService,
        OauthService,
        OtpService,
        LoginService,
        TwoFaAuthService,
        TwoFaAuthStrategy,
        TwoFaAuthTypeService,
        TwoFaAuthSmsService,
        TwoFaAuthEmailService,
      ],
    }).compile();

    controller = module.get<TwoFactorAuthController>(TwoFactorAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
