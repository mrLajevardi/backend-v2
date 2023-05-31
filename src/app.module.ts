import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './infrastructure/database/entities/User';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './application/base/auth/guard/jwt-auth.guard';
import { UserModule } from './application/base/user/user.module';
import { VastModule } from './application/vast/vast.module';
import { AuthModule } from './application/base/auth/auth.module';
import { AclModule } from './application/base/acl/acl.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import configurations from './infrastructure/config/configurations';
import { ConfigModule } from '@nestjs/config';
import { AiController } from 'src/application/ai/ai.controller';
import { AiModule } from './application/ai/ai.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configurations],
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    VastModule,
    AclModule,
    AiModule,
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
