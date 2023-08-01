import { Test, TestingModule } from '@nestjs/testing';
import { SmsService } from './sms.service';

describe('SmsService', () => {
  let service: SmsService;

  beforeEach(async () => {
    module =  Test.createTestingModule({
      providers: [SmsService],
    }).compile();

    service = module.get<SmsService>(SmsService);
  });

  afterAll(async () => { await module.close(); });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
