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
import { TransactionsModule } from '../../transactions/transactions.module';
import { ServiceModule } from '../../service/service.module';
import { UserInfoService } from '../service/user-info.service';
import { VitrificationServiceService } from '../service/vitrification.service.service';
import { UsersFactoryService } from '../service/user.factory.service';
import { TestBed } from '@automock/jest';

describe('UserController', () => {
  let controller: UserController;

  beforeAll(async () => {
    const { unit } = TestBed.create(UserController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
