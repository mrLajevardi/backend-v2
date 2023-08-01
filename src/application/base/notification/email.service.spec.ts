import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { EmailContentService } from './email-content.service';
import { NotificationService } from './notification.service';
import { SmsService } from './sms.service';

describe('EmailService', () => {
  let service: EmailService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        EmailContentService,
        EmailService,
        SmsService,
        NotificationService
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
