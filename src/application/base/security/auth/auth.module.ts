import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { CrudModule } from '../../crud/crud.module';
import { UserTableModule } from '../../crud/user-table/user-table.module';
import { NotificationModule } from '../../notification/notification.module';
import { OtpService } from '../security-tools/otp.service';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { OtpStrategy } from './strategy/otp.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { LinkedInStrategy } from './strategy/linked-in.strategy';
import { GithubStrategy } from './strategy/github.strategy';
import { OauthService } from './service/oauth.service';
import { PassportModule } from '@nestjs/passport';
import { LoginService } from './service/login.service';
import { UserModule } from '../../user/user.module';
import { SecurityToolsModule } from '../security-tools/security-tools.module';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { RobotStrategy } from './strategy/robot.strategy';

@Module({
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
      signOptions: { expiresIn: '28800s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    OauthService,
    OtpService,
    LocalStrategy,
    JwtStrategy,
    OtpStrategy,
    GoogleStrategy,
    LinkedInStrategy,
    GithubStrategy,
    RobotStrategy,
    AuthService,
    LoginService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
