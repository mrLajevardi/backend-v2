import { Test, TestingModule } from '@nestjs/testing';
import { OauthService } from './oauth.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CrudModule } from 'src/application/base/crud/crud.module';
import { UserTableModule } from 'src/application/base/crud/user-table/user-table.module';
import { NotificationModule } from 'src/application/base/notification/notification.module';
import { UserModule } from 'src/application/base/user/user.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { SecurityToolsModule } from '../../security-tools/security-tools.module';
import { LoginService } from './login.service';
import { OtpService } from '../../security-tools/otp.service';

describe('OauthService', () => {
  let service: OauthService;

  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        PassportModule,
        CrudModule,
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
      providers: [OauthService, LoginService, OtpService],
    }).compile();

    service = module.get<OauthService>(OauthService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
