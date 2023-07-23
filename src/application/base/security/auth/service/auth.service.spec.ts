import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { UserTableService } from '../../../crud/user-table/user-table.service';

describe('AuthService', () => {
  let service: AuthService;
  let testDataService: TestDataService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      providers: [AuthService, UserService, JwtService, UserTableService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
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

    it('should return true in comparison', async () => {
      const hash1 = await userService.getPasswordHash('abc123');
      const result = await service.comparePassword(hash1, 'abc123');
      expect(result).toBeTruthy();
    });
  });
});
