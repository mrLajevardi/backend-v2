import { Test, TestingModule } from '@nestjs/testing';
import { TwoFaAuthService } from './two-fa-auth.service';

describe('TwoFaAuthService', () => {
  let provider: TwoFaAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwoFaAuthService],
    }).compile();

    provider = module.get<TwoFaAuthService>(TwoFaAuthService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
