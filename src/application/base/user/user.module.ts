import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { PaymentModule } from 'src/application/payment/payment.module';
import { NotificationModule } from '../notification/notification.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../security/auth/auth.module';
import { UserAdminService } from './service/user-admin.service';
import { SecurityToolsModule } from '../security/security-tools/security-tools.module';
import { UserAdminController } from './controller/user-admin.controller';

@Module({
  imports: [
    DatabaseModule,
    CrudModule,
    LoggerModule,
    PaymentModule,
    NotificationModule,
    SecurityToolsModule,
  ],
  providers: [UserService, UserAdminService],
  controllers: [UserController, UserAdminController],
  exports: [UserService],
})
export class UserModule {}
