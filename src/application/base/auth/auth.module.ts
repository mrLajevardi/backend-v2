import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';


@Module({
  imports: [
    UserModule, 
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1800s' },
    })],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy, 
    JwtStrategy],
  exports: [
    AuthService,
  ]
})
export class AuthModule {}
