import { Test, TestingModule } from '@nestjs/testing';
import { OtpService } from './otp.service';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';

describe('OtpService', () => {
  let service: OtpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [OtpService],
    }).compile();

    service = module.get<OtpService>(OtpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
