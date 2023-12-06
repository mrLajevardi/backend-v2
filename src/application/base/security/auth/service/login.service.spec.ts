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

describe('LoginService', () => {
  let service: LoginService;

  let module: TestingModule;
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
    }).compile();

    service = module.get<LoginService>(LoginService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
