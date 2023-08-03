import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { SmsService } from './sms.service';
import { EmailContentService } from './email-content.service';
import { EmailService } from './email.service';

describe('NotificationService', () => {
  let service: NotificationService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [
        EmailContentService,
        EmailService,
        SmsService,
        NotificationService
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
