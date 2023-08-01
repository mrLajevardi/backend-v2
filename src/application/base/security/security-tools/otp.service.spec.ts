import { Test, TestingModule } from '@nestjs/testing';
import { OtpService } from './otp.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('OtpService', () => {
  let service: OtpService;

  beforeEach(async () => {
    module =  Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [OtpService],
    }).compile();

    service = module.get<OtpService>(OtpService);
  });

  afterAll(async () => { await module.close(); });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
