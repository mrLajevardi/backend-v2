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

describe('UserAdminService', () => {
  let service: UserAdminService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        AbilityModule,
        CrudModule,
        LoggerModule,
        PaymentModule,
        JwtModule,
        NotificationModule,
        SecurityToolsModule,
        TransactionsModule,
      ],
      providers: [
        UserService,
        UserAdminService,
        RedisCacheService,
        UserInfoService,
      ],
    }).compile();

    service = module.get<UserAdminService>(UserAdminService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
