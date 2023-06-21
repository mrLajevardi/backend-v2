import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './application/base/security/auth/auth.service';
import { UserService } from './application/base/user/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './application/base/security/auth/dto/login.dto';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './application/base/security/auth/guard/jwt-auth.guard';
import { TestDatabaseModule } from './infrastructure/database/test-database.module';
import { TestDataService } from './infrastructure/database/test-data.service';

describe('AppController', () => {
  let controller: AppController;
  let authService: AuthService;
  let testDataService: TestDataService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule],
      controllers: [AppController],
      providers: [
        UserService,
        AppService,
        AuthService,
        {
          provide: JwtService,
          useValue: new JwtService({
            secret: 'aaa',
          }),
        },
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    authService = module.get<AuthService>(AuthService);
    testDataService = module.get<TestDataService>(TestDataService);
    await testDataService.seedTestData();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(controller.getHello()).toBe('Hello World!');
    });
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
