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
import { UserPayload } from '../dto/user-payload.dto';
import { TwoFaAuthInterface } from '../classes/interface/two-fa-auth.interface';
import { SendOtpTwoFactorAuthDto } from '../dto/send-otp-two-factor-auth.dto';
import {TwoFaAuthTypeEnum} from "../enum/two-fa-auth-type.enum";

describe('TwoFaAuthService', () => {
  let service: TwoFaAuthService;
  const mockTwoFaAuthStrategy = {
    setStrategy: jest.fn((strategy: TwoFaAuthInterface) => {
      console.log(strategy);
    }),
    sendOtp: jest.fn(
      async (user: UserPayload): Promise<SendOtpTwoFactorAuthDto> => {
        return {
          hash: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        } as SendOtpTwoFactorAuthDto;
      },
    ),
    verifyOtp: jest.fn(
      async (
        user: UserPayload,
        otp: string,
        hash: string,
      ): Promise<boolean> => {
        return Promise.resolve(true);
      },
    ),
  };
  const mockUserTableService = {
    update: jest.fn((userId: number, dto: any): Promise<any> => {
      return Promise.resolve({});
    }),
    findById: jest.fn((userId: number) => {
      if (userId == 1060){
        return {
          id: userId ,
          twoFactorAuth : '1'
        }
      }else {
        return {
          id: userId ,
          twoFactorAuth : '0'
        }
      }

    })
  };
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
    })
      .overrideProvider(TwoFaAuthStrategy)
      .useValue(mockTwoFaAuthStrategy)
      .overrideProvider(UserTableService)
      .useValue(mockUserTableService)
      .compile();

    service = module.get<TwoFaAuthService>(TwoFaAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('enable two factor authenticate', () => {
    it('should be return true if valid data enable ', async () => {
      const user: UserPayload = {
        userId: 1060,
        personalVerification: true,
      };
      /*
       *** type can be sms or email
       */
      const type = TwoFaAuthTypeEnum.Sms;
      const data = await service.enable(user, type);

      expect(data).not.toBeNull();
      expect(data).toEqual({
        hash: expect.any(String),
      });
    });
    it('should be return true if valid data enableVerification', async () => {
      const user: UserPayload = {
        userId: 1060,
        personalVerification: true,
      };
      /*
       *** type can be sms or email
       */

      const type = TwoFaAuthTypeEnum.Sms;
      const data = await service.enableVerification(
        user,
        type,
        '123456',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      );

      expect(data).not.toBeNull();
      expect(data).toBeTruthy();
    });
  });
});
