import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import { UserService } from '../../../user/service/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { UserTableService } from '../../../crud/user-table/user-table.service';
import { PassportModule } from '@nestjs/passport';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { UserTableModule } from 'src/application/base/crud/user-table/user-table.module';
import { NotificationModule } from 'src/application/base/notification/notification.module';
import { UserModule } from 'src/application/base/user/user.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { SecurityToolsModule } from '../../security-tools/security-tools.module';
import { OauthService } from '../service/oauth.service';
import { OtpService } from '../../security-tools/otp.service';
import { LoginService } from '../service/login.service';
import { PaymentModule } from 'src/application/payment/payment.module';

describe('AuthController', () => {
  let controller: AuthController;
  let testDataService: TestDataService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        PassportModule,
        CrudModule,
        UserTableModule,
        UserModule,
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
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        JwtService,
        UserTableService,
        OauthService,
        OtpService,
        LoginService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    testDataService = module.get<TestDataService>(TestDataService);

    await testDataService.seedTestData();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
