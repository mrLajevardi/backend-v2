import { Test, TestingModule } from '@nestjs/testing';
import { UserAdminController } from './user-admin.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { PaymentModule } from 'src/application/payment/payment.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { CrudModule } from '../../crud/crud.module';
import { NotificationModule } from '../../notification/notification.module';
import { SecurityToolsModule } from '../../security/security-tools/security-tools.module';
import { UserAdminService } from '../service/user-admin.service';
import { UserService } from '../service/user.service';
import { RedisCacheService } from '../../../../infrastructure/utils/services/redis-cache.service';
import { TransactionsModule } from '../../transactions/transactions.module';
import { UserInfoService } from '../service/user-info.service';

describe('UserAdminController', () => {
  let controller: UserAdminController;

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
        TransactionsModule,
      ],
      providers: [
        UserService,
        UserAdminService,
        RedisCacheService,
        UserInfoService,
      ],
      controllers: [UserAdminController],
    }).compile();

    controller = module.get<UserAdminController>(UserAdminController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
