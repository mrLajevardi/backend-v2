import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './application/base/security/auth/guard/jwt-auth.guard';
import { UserModule } from './application/base/user/user.module';
import { VastModule } from './application/vast/vast.module';
import { AuthModule } from './application/base/security/auth/auth.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import configurations from './infrastructure/config/configurations';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from './application/ai/ai.module';
import { TasksModule } from './application/base/tasks/tasks.module';
import { TransactionsModule } from './application/base/transactions/transactions.module';
import { AbilityModule } from './application/base/security/ability/ability.module';
import { BullModule, BullQueueEvents } from '@nestjs/bull';
import { VdcModule } from './application/vdc/vdc.module';
import { NetworkService } from './application/vdc/service/network.service';
import { CrudModule } from './application/base/crud/crud.module';
import { SessionsModule } from './application/base/sessions/sessions.module';
import { OrganizationModule } from './application/base/organization/organization.module';
import { VgpuModule } from './application/vgpu/vgpu.module';
import { ApplicationPortProfileService } from './src/application/edge-gateway/application-port-profile.service';
import { NatModule } from './application/nat/nat.module';
import { NetworksModule } from './application/networks/networks.module';
import { EdgeGatewayController } from './application/edge-gateway.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configurations],
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    //infrastructure
    DatabaseModule,
    CrudModule,
    SessionsModule,
    OrganizationModule,
    // tables
    UserModule,
    TasksModule,
    TransactionsModule,
    //core
    AuthModule,
    AiModule,
    VgpuModule,
    VastModule,
    AbilityModule,
    VdcModule,
    CrudModule,
    NatModule,
    NetworksModule,
  ],
  controllers: [AppController, EdgeGatewayController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    NetworkService,
    ApplicationPortProfileService,
  ],
  exports: [],
})
export class AppModule {}
