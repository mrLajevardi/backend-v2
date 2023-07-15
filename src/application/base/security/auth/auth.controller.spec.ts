import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { TestDatabaseModule } from 'src/infrastructure/database/test-database.module';
import { TestDataService } from 'src/infrastructure/database/test-data.service';
import { UserTableService } from '../../crud/user-table/user-table.service';
import { LoginDto } from './dto/login.dto';

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

  describe('login', () => {
    it('should return token', async () => {
      const loginDto = new LoginDto();
      loginDto.username = 'back2-test';
      loginDto.password = 'abc123';
      jest
        .spyOn(authService, 'login')
        .mockResolvedValueOnce({ access_token: 'testtoken' });

      const response = await controller.login(loginDto);
      expect(response.access_token).toBeDefined();
    });

    it('should not respond', async () => {
      const loginDto = new LoginDto();
      loginDto.username = 'back2-test';
      loginDto.password = '123132';
      jest.spyOn(authService, 'login').mockResolvedValueOnce(null);

      const response = await controller.login(loginDto);
      expect(response).toBe(null);
    });
  });

});
