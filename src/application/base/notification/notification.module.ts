import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { EmailService } from './email.service';
import { EmailContentService } from './email-content.service';

@Module({
  providers: [SmsService, EmailService, EmailContentService]
})
export class NotificationModule {}
