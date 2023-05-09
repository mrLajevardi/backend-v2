import { Module } from '@nestjs/common';
import { SmsService } from './sms/sms.service';
import { EmailService } from './email/email.service';

@Module({
  providers: [SmsService, EmailService]
})
export class NotificationModule {}
