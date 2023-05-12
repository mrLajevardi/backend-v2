import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './infrastructure/entities/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormconfig } from './infrastructure/configs/ormconfig';
import { AuthService } from './application/base/auth/auth.service';
import { UserService } from './application/base/user/user.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './application/base/auth/guards/jwt-auth.guard';
import { UserModule } from './application/base/user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './application/base/auth/constants';
import { LocalStrategy } from './application/base/auth/guards/local.strategy';
import { JwtStrategy } from './application/base/auth/guards/jwt.strategy';
import { JsonContains } from 'typeorm';
import { AuthModule } from './application/base/auth/auth.module';
import { CaslModule } from './application/base/casl/casl.module';
import { VastModule } from './application/vast/vast.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig.primary), //default
    UserModule,
    AuthModule,
    VastModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
