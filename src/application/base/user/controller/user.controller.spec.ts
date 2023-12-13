import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { JwtModule } from '@nestjs/jwt';
import { PaymentModule } from 'src/application/payment/payment.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { CrudModule } from '../../crud/crud.module';
import { NotificationModule } from '../../notification/notification.module';
import { SecurityToolsModule } from '../../security/security-tools/security-tools.module';
import { UserAdminService } from '../service/user-admin.service';
import { LoginService } from '../../security/auth/service/login.service';
import { OtpService } from '../../security/security-tools/otp.service';
import { RedisCacheService } from '../../../../infrastructure/utils/services/redis-cache.service';
import { AuthModule } from '../../security/auth/auth.module';
import { forwardRef } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let testDataService: TestDataService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        CrudModule,
        LoggerModule,
        PaymentModule,
        JwtModule,
        NotificationModule,
        SecurityToolsModule,
        forwardRef(() => AuthModule),
        // AuthModule ,
      ],
      providers: [
        UserService,
        UserAdminService,
        LoginService,
        OtpService,
        RedisCacheService,
      ],
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
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
