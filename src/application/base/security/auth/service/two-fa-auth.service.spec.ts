import { Test, TestingModule } from '@nestjs/testing';
import { TwoFaAuthService } from './two-fa-auth.service';
import { TwoFaAuthTypeService } from '../classes/two-fa-auth-type.service';
import { TwoFaAuthStrategy } from '../classes/two-fa-auth.strategy';
import { TwoFaAuthSmsService } from '../classes/two-fa-auth-sms.service';
import { TwoFaAuthEmailService } from '../classes/two-fa-auth-email.service';
import { NotificationService } from '../../../notification/notification.service';
import { UserTableService } from '../../../crud/user-table/user-table.service';
import { OtpService } from '../../security-tools/otp.service';
import { EmailService } from '../../../notification/email.service';
import { SmsService } from '../../../notification/sms.service';
import { EmailContentService } from '../../../notification/email-content.service';
import { Repository } from 'typeorm';
import { User } from '../../../../../infrastructure/database/entities/User';
import { DatabaseModule } from '../../../../../infrastructure/database/database.module';
import { CrudModule } from '../../../crud/crud.module';
import { LoggerModule } from '../../../../../infrastructure/logger/logger.module';
import { PaymentModule } from '../../../../payment/payment.module';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from '../../../notification/notification.module';
import { SecurityToolsModule } from '../../security-tools/security-tools.module';

describe('TwoFaAuthService', () => {
  let provider: TwoFaAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        CrudModule,
        LoggerModule,
        PaymentModule,
        JwtModule,
        NotificationModule,
        SecurityToolsModule,
      ],
      providers: [
        TwoFaAuthService,
        TwoFaAuthTypeService,
        TwoFaAuthStrategy,
        TwoFaAuthSmsService,
        TwoFaAuthEmailService,
        NotificationService,
        UserTableService,
        OtpService,
        EmailService,
        SmsService,
        EmailContentService,
        Repository<User>,
      ],
    }).compile();

    provider = module.get<TwoFaAuthService>(TwoFaAuthService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
