import { Module } from '@nestjs/common';
import { NotificationModule } from './notification/notification.module';
import { LoggingModule } from './logging/logging.module';

@Module({
  imports: [NotificationModule, LoggingModule],
})
export class UtilsModule {}
