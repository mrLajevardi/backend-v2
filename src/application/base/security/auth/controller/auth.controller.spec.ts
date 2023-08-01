import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import { UserService } from '../../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { UserTableService } from '../../../crud/user-table/user-table.service';
import { LoginDto } from '../dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let testDataService: TestDataService;
  let authService: AuthService;

  beforeEach(async () => {
    module =  Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [AuthController],
      providers: [AuthService, UserService, JwtService, UserTableService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    testDataService = module.get<TestDataService>(TestDataService);
    authService = module.get<AuthService>(AuthService);

    await testDataService.seedTestData();
  });

  afterAll(async () => { await module.close(); });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
