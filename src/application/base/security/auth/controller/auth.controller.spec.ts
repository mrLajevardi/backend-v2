import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import { UserService } from '../../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { UserTableService } from '../../../crud/user-table/user-table.service';
import { LoginDto } from '../dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let testDataService: TestDataService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      controllers: [AuthController],
      providers: [AuthService, UserService, JwtService, UserTableService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    testDataService = module.get<TestDataService>(TestDataService);
    authService = module.get<AuthService>(AuthService);

    await testDataService.seedTestData();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
