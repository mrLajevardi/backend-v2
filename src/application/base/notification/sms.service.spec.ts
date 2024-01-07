import { SmsService } from './sms.service';
import { TestBed } from '@automock/jest';

describe('SmsService', () => {
  let service: SmsService;

  beforeAll(async () => {
    const { unit } = TestBed.create(SmsService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
