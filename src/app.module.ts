import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './application/base/security/auth/guard/jwt-auth.guard';
import { UserModule } from './application/base/user/user.module';
import { VastModule } from './application/vast/vast.module';
import { AuthModule } from './application/base/security/auth/auth.module';
import { DatabaseModule } from './infrastructure/database/database.module';
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
import { ApplicationPortProfileService } from './application/edge-gateway/service/application-port-profile.service';
import { NatModule } from './application/nat/nat.module';
import { NetworksModule } from './application/networks/networks.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { ServiceModule } from './application/base/service/service.module';
import { EdgeGatewayModule } from './application/edge-gateway/edge-gateway.module';
import { VmModule } from './application/vm/vm.module';
import { NotificationModule } from './application/base/notification/notification.module';
import { OtpService } from './application/base/security/security-tools/otp.service';
import { TicketModule } from './application/base/ticket/ticket.module';
import { OauthService } from './application/base/security/auth/service/oauth.service';
import { SecurityToolsModule } from './application/base/security/security-tools/security-tools.module';
import { GroupModule } from './application/base/group/group.module';
import { PayAsYouGoModule } from './application/base/pay-as-you-go/pay-as-you-go.module';
import { ServicePropertiesModule } from './application/base/service-properties/service-properties.module';
import { RobotModule } from './application/robot/robot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    EdgeGatewayModule,
    LoggerModule,
    ServiceModule,
    VmModule,
    NotificationModule,
    TicketModule,
    SecurityToolsModule,
    GroupModule,
    PayAsYouGoModule,
    ServicePropertiesModule,
    RobotModule,
  ],
  controllers: [AppController],
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
