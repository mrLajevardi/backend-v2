import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CrudModule } from '../crud/crud.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { PaymentModule } from 'src/application/payment/payment.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [DatabaseModule, CrudModule, LoggerModule, PaymentModule, NotificationModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
