import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
import { EmailContentService } from './email-content.service';

@Injectable()
export class NotificationService {
    constructor(
        public readonly email : EmailService,
        public readonly sms : SmsService,
        public readonly emailContents: EmailContentService,
    ){}
}
