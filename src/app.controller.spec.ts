import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './application/base/auth/auth.service';
import { UserService } from './application/base/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { TestDBProviders } from './infrastructure/test-utils/providers';
import { LoginDto } from './application/base/auth/dto/login.dto';

describe('AppController', () => {
  let controller : AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
      ],
      controllers: [
        AppController,
      ],
      providers: [
        TestDBProviders.userProvider,
        AppService,
        AuthService,
        UserService,
        JwtService
      ],
    }).compile();

    controller = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(controller.getHello()).toBe('Hello World!');
    });
  });

  describe('login' , () => {
    it('should return token', async () => {
      let loginDto  = new LoginDto(); 
      loginDto.username = 'back2-test';
      loginDto.password = 'abc123';
      const response = await controller.login(loginDto);
      expect(response.access_token).toBeDefined(); 
    })
  })
});
