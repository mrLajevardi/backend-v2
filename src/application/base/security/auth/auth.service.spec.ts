import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../user/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';

describe('AuthService', () => {
  let service: AuthService;
  let testDataService: TestDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [AuthService, UserService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate user', () => {
    it('should be null with bad user pass', async () => {
      const result = await service.validateUser('back2-test', 'abc');
      expect(result).toBeNull();
    });

    it('should return user if username password are valid ', async () => {
      const result = await service.validateUser('back2-test', 'abc123');
      expect(result).toBeDefined();
      expect(result.username).toBeDefined();
      expect(result.username).toBe('back2-test');
    });
  });
});
