import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { CrudModule } from '../../crud/crud.module';
import { NotificationModule } from '../../notification/notification.module';
import { OtpService } from '../security-tools/otp.service';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { OtpStrategy } from './strategy/otp.strategy';
import { GoogleStrategy } from './strategy/google.strategy';

// import { GithubStrategy } from './strategy/github-strategy';
import { OauthService } from './service/oauth.service';
import { PassportModule } from '@nestjs/passport';
import { LoginService } from './service/login.service';
import { UserModule } from '../../user/user.module';
import { SecurityToolsModule } from '../security-tools/security-tools.module';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { RobotStrategy } from './strategy/robot.strategy';
import { AbilityModule } from '../ability/ability.module';
import { LinkedinStrategy } from './strategy/linkedin.strategy';
import { OauthServiceFactory } from './service/oauth.service.factory';
import { GithubStrategy } from './strategy/github.strategy';
import { TwoFaAuthService } from './service/two-fa-auth.service';
import { TwoFaAuthTypeService } from './classes/two-fa-auth-type.service';
import { TwoFaAuthSmsService } from './classes/two-fa-auth-sms.service';
import { TwoFaAuthEmailService } from './classes/two-fa-auth-email.service';
import { TwoFaAuthStrategy } from './classes/two-fa-auth.strategy';

@Module({
  imports: [
    DatabaseModule,
    AbilityModule,
    PassportModule,
    CrudModule,
    UserModule,
    NotificationModule,
    LoggerModule,
    SecurityToolsModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '28800s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    OauthServiceFactory,
    OauthService,
    OtpService,
    LocalStrategy,
    JwtStrategy,
    OtpStrategy,
    GoogleStrategy,
    // LinkedInStrategy,
    LinkedinStrategy,
    GithubStrategy,
    RobotStrategy,
    AuthService,
    LoginService,
    TwoFaAuthService,
    TwoFaAuthTypeService,
    TwoFaAuthSmsService,
    TwoFaAuthEmailService,
    TwoFaAuthStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
