import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { EmailService } from './email.service';
import { EmailContentService } from './email-content.service';
import { NotificationService } from './notification.service';

@Module({
  providers: [
    SmsService,
    EmailService,
    EmailContentService,
    NotificationService,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
