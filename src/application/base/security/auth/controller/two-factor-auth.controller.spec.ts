import { TwoFactorAuthController } from './two-factor-auth.controller';
import { TestBed } from '@automock/jest';

describe('TwoFactorAuthController', () => {
  let controller: TwoFactorAuthController;

  beforeAll(async () => {
    const { unit } = TestBed.create(TwoFactorAuthController).compile();
    controller = unit;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
