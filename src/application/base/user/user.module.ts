import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { PaymentModule } from 'src/application/payment/payment.module';
import { NotificationModule } from '../notification/notification.module';
import { JwtModule } from '@nestjs/jwt';
import { UserAdminService } from './service/user-admin.service';
import { SecurityToolsModule } from '../security/security-tools/security-tools.module';
import { UserAdminController } from './controller/user-admin.controller';
import { AbilityModule } from '../security/ability/ability.module';
import { LoginService } from '../security/auth/service/login.service';
import { OtpService } from '../security/security-tools/otp.service';
import { RedisCacheService } from '../../../infrastructure/utils/services/redis-cache.service';
import { AuthModule } from '../security/auth/auth.module';
import { VitrificationServiceService } from './service/vitrification.service.service';
import { UserInfoService } from './service/user-info.service';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    DatabaseModule,
    CrudModule,
    LoggerModule,
    PaymentModule,
    JwtModule,
    NotificationModule,
    SecurityToolsModule,
    AbilityModule,
    TransactionsModule,
    forwardRef(() => AuthModule),
  ],
  providers: [
    UserService,
    UserAdminService,
    LoginService,
    OtpService,
    RedisCacheService,
    VitrificationServiceService,
    UserInfoService,
    // TwoFaAuthService,
  ],
  controllers: [UserController, UserAdminController],
  exports: [UserService, RedisCacheService, UserInfoService],
})
export class UserModule {}
