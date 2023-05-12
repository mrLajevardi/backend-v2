import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BaseModule } from './application/base/base.module';
import { User } from './infrastructure/entities/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormconfig } from './infrastructure/configs/ormconfig';
import { AuthService } from './application/base/security/auth/auth.service';
import { UserService } from './application/base/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig.primary), //default
    BaseModule,
    TypeOrmModule.forFeature([User]),

  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    UserService
  ],
})
export class AppModule {}
