import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { PaymentModule } from 'src/application/payment/payment.module';
import { NotificationModule } from '../notification/notification.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../security/auth/auth.module';
import { UserAdminService } from './user-admin.service';

@Module({
  imports: [
    DatabaseModule,
    CrudModule,
    LoggerModule,
    PaymentModule,
    NotificationModule,
    AuthModule,
  ],
  providers: [UserService, UserAdminService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
