import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { UserTableService } from '../../../crud/user-table/user-table.service';
import {
  comparePassword,
  encryptPassword,
} from 'src/infrastructure/helpers/helpers';

describe('AuthService', () => {
  let service: AuthService;
  let testDataService: TestDataService;
  let userService: UserService;

  beforeEach(async () => {
    module =  Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [AuthService, UserService, JwtService, UserTableService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  afterAll(async () => { await module.close(); });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate user', () => {
    it('should be null with bad user pass', async () => {
      const result = await service.login.validateUser('back2-test', 'abc');
      expect(result).toBeNull();
    });

    it('should return user if username password are valid ', async () => {
      const result = await service.login.validateUser('back2-test', 'abc123');
      expect(result).toBeDefined();
      expect(result.username).toBeDefined();
      expect(result.username).toBe('back2-test');
    });

    it('should return true in comparison', async () => {
      const hash1 = await encryptPassword('abc123');
      const result = await comparePassword(hash1, 'abc123');
      expect(result).toBeTruthy();
    });
  });
});
