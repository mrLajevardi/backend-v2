import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { TestDBProviders } from 'src/infrastructure/test-utils/providers';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        JwtService,
        TestDBProviders.userProvider,
        TestDBProviders.accessTokenProvider,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate user', () => {
    it('should be null with bad user pass', async () => {
      const result = await service.validateUser('back2-test','abc');
      expect(result).toBeNull();
    });

    it('should return user if username password are valid ', async () => {
      const result = await service.validateUser('back2-test','abc123');
      expect(result).toBeDefined();
      expect(result.username).toBeDefined();
      expect(result.username).toBe('back2-test');
    });
  })
});
