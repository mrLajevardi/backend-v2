import { Test, TestingModule } from '@nestjs/testing';
import { SmsService } from './sms.service';
import { EmailContentService } from './email-content.service';
import { EmailService } from './email.service';
import { NotificationService } from './notification.service';

describe('SmsService', () => {
  let service: SmsService;

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

    service = module.get<SmsService>(SmsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
