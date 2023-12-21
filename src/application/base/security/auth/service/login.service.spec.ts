import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from './login.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { NotificationModule } from 'src/application/base/notification/notification.module';
import { UserModule } from 'src/application/base/user/user.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { SecurityToolsModule } from '../../security-tools/security-tools.module';
import { OtpService } from '../../security-tools/otp.service';
import { AbilityModule } from '../../ability/ability.module';
import { AuthModule } from '../auth.module';
import { UserPayload } from '../dto/user-payload.dto';
import { UserTableService } from '../../../crud/user-table/user-table.service';
import { TwoFaAuthService } from './two-fa-auth.service';
import {TwoFaAuthTypeEnum} from "../enum/two-fa-auth-type.enum";

describe('LoginService', () => {
  let service: LoginService;

  let module: TestingModule;
  const mockUserData = {
    id: 1,
    username: 'u-09123456789',
    aiAccessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    personalVerification: true,
  };
  const mockUserTableService = {
    findById: jest.fn((userId: number) => {
      if (userId == 1) {
        return mockUserData;
      }
      return null;
    }),
  };

  const mockTwoFactorService = {
    sendOtp: jest.fn((user: UserPayload) => {
      return {
        hash: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      };
    }),
    getUserTwoFactorTypes: jest.fn((userId:number): number[]=>{
      if(userId == 1060){
        return [1]
      }else {
        return [0]
      }
  })
  };
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        AbilityModule,
        PassportModule,
        CrudModule,
        AuthModule,
        UserModule,
        NotificationModule,
        LoggerModule,
        SecurityToolsModule,
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1800s' },
        }),
      ],
      providers: [LoginService, OtpService],
    })
      .overrideProvider(UserTableService)
      .useValue(mockUserTableService)
      .overrideProvider(TwoFaAuthService)
      .useValue(mockTwoFactorService)
      .compile();

    service = module.get<LoginService>(LoginService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login process', () => {
    it('should be return access and ai token if user do not have two factor authenticate', async () => {
      const user: UserPayload = {
        userId: 1060,
        twoFactorAuth: '0',
        aiAccessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      };

      jest
        .spyOn(service, 'getLoginToken')
        .mockImplementation(
          (userId: number, impersonateId?: number, aiAccessToken?: string) => {
            return Promise.resolve({
              access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
              ai_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
            });
          },
        );

      const data = await service.loginProcess(user);
      expect(data.two_factor_authenticate).toEqual(false);
      expect(data).toEqual({
        two_factor_authenticate: expect.any(Boolean),
        access_token: expect.any(String),
        ai_token: expect.any(String),
      });
    });

    it('should be return hash if user have two factor authenticate', async () => {
      const user: UserPayload = {
        userId: 1060,
        twoFactorAuth: '1',
        aiAccessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      };

      const data = await service.loginProcess(user);
      expect(data.two_factor_authenticate).toEqual(true);
      expect(data).toEqual({
        two_factor_authenticate: expect.any(Boolean),
        types: expect.any(Array),
      });
    });
  });
});
