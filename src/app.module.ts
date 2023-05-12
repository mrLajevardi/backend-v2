import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './infrastructure/entities/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormconfig } from './infrastructure/configs/ormconfig';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './application/base/auth/guards/jwt-auth.guard';
import { UserModule } from './application/base/user/user.module';
import { VastModule } from './application/vast/vast.module';
import { AuthModule } from './application/base/auth/auth.module';

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
