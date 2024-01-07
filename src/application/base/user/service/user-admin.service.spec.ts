import { Test, TestingModule } from '@nestjs/testing';
import { UserAdminService } from './user-admin.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { PaymentModule } from 'src/application/payment/payment.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { CrudModule } from '../../crud/crud.module';
import { NotificationModule } from '../../notification/notification.module';
import { SecurityToolsModule } from '../../security/security-tools/security-tools.module';
import { UserService } from './user.service';
import { AbilityModule } from '../../security/ability/ability.module';
import { RedisCacheService } from '../../../../infrastructure/utils/services/redis-cache.service';
import { TransactionsModule } from '../../transactions/transactions.module';
import { UserInfoService } from './user-info.service';
import { UsersFactoryService } from './user.factory.service';
import { TestBed } from '@automock/jest';

describe('UserAdminService', () => {
  let service: UserAdminService;

  beforeAll(async () => {
    const { unit } = TestBed.create(UserAdminService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
