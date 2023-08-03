import { Test, TestingModule } from '@nestjs/testing';
import { EmailContentService } from './email-content.service';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
import { NotificationService } from './notification.service';

describe('EmailContentService', () => {
  let service: EmailContentService;

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

    service = module.get<EmailContentService>(EmailContentService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
