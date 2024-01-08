import { OtpService } from './otp.service';
import { TestBed } from '@automock/jest';

describe('OtpService', () => {
  let service: OtpService;

  beforeAll(async () => {
    const { unit } = TestBed.create(OtpService).compile();
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
