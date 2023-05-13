import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './application/base/auth/auth.service';
import { UserService } from './application/base/user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TestDBProviders } from './infrastructure/test-utils/providers';
import { LoginDto } from './application/base/auth/dto/login.dto';
import { UserModule } from './application/base/user/user.module';
import { AuthModule } from './application/base/auth/auth.module';
import { VastModule } from './application/vast/vast.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './application/base/auth/guard/jwt-auth.guard';
import { jwtConstants } from './application/base/auth/constants';

describe('AppController', () => {
  let controller : AppController;
  let authService: AuthService;


  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [
        AppController,
      ],
      providers: [
        TestDBProviders.userProvider,
        UserService,
        AppService,
        AuthService,
        {
          provide: JwtService,
          useValue: new JwtService({
            secret: 'aaa'
          }),
        },
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
      ],
    }).compile();

    controller = app.get<AppController>(AppController);
    authService = app.get<AuthService>(AuthService);

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
      jest.spyOn(authService, 'login').mockResolvedValueOnce({ access_token: 'testtoken' });

      const response = await controller.login(loginDto);
      expect(response.access_token).toBeDefined(); 
    })

    it('should not respond', async() => {
      let loginDto  = new LoginDto(); 
      loginDto.username = 'back2-test';
      loginDto.password = '123132';
      jest.spyOn(authService, 'login').mockResolvedValueOnce(null);

      const response = await controller.login(loginDto);
      expect(response).toBe(null);
    })
  })


});
