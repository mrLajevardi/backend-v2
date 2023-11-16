import { Test, TestingModule } from '@nestjs/testing';
import { TwoFaAuthService } from './two-fa-auth.service';
import { TwoFaAuthTypeService } from '../classes/two-fa-auth-type.service';
import { TwoFaAuthStrategy } from '../classes/two-fa-auth.strategy';

describe('TwoFaAuthService', () => {
  let provider: TwoFaAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwoFaAuthService, TwoFaAuthTypeService, TwoFaAuthStrategy],
    }).compile();

    provider = module.get<TwoFaAuthService>(TwoFaAuthService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
