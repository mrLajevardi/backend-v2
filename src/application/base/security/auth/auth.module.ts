import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { UserModule } from '../../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { CrudModule } from '../../crud/crud.module';
import { UserTableModule } from '../../crud/user-table/user-table.module';
import { LoginService } from './service/login.service';
import { OauthService } from './service/oauth.service';
import { NotificationModule } from '../../notification/notification.module';
import { OtpService } from './service/otp.service';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';

@Module({
  imports: [
    UserModule,
    CrudModule,
    UserTableModule,
    NotificationModule,
    LoggerModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1800s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, LoginService, OauthService, OtpService],
  exports: [AuthService],
})
export class AuthModule {}
