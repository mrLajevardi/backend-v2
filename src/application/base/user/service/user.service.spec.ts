import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { UserTableService } from '../../crud/user-table/user-table.service';
import { encryptPassword } from 'src/infrastructure/helpers/helpers';
import { JwtModule } from '@nestjs/jwt';
import { PaymentModule } from 'src/application/payment/payment.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { CrudModule } from '../../crud/crud.module';
import { NotificationModule } from '../../notification/notification.module';
import { SecurityToolsModule } from '../../security/security-tools/security-tools.module';
import { UserAdminService } from './user-admin.service';

describe('UserService', () => {
  let table: UserTableService;
  let service: UserService;
  let testDataService: TestDataService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        CrudModule,
        LoggerModule,
        PaymentModule,
        JwtModule,
        NotificationModule,
        SecurityToolsModule,
      ],
      providers: [UserService, UserAdminService],
    }).compile();

    table = module.get<UserTableService>(UserTableService);
    service = module.get<UserService>(UserService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByPhoneNumber', () => {
    it('should return my user data', async () => {
      const user = await service.findByPhoneNumber('09133089726');
      expect(user).toBeDefined();
    });
  });

  describe('getUsers', () => {
    it('should return some users', async () => {
      const users = await table.find({});
      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe('findOne', () => {
    it('should be null if user not found', async () => {
      const user = await table.findOne({
        where: { username: 'back2-test1111' },
      });
      expect(user).toBeNull();
    });

    it('should return user if user exists', async () => {
      const user = await table.findOne({ where: { username: 'back2-test' } });
      expect(user.username).toBeDefined();
      expect(user.username).toBe('back2-test');
    });
  });

  describe('hashing', () => {
    it('should be return non equal hashes', async () => {
      const hash1 = await encryptPassword('abc123');
      const hash2 = await encryptPassword('abc123');
      expect(hash1).not.toBe(hash2);
    });
  });
});
