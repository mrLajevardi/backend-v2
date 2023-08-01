import { Test, TestingModule } from '@nestjs/testing';
import { OtpService } from './otp.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

describe('OtpService', () => {
  let service: OtpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [OtpService],
    }).compile();

    service = module.get<OtpService>(OtpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
