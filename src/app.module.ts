import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
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
import { BullModule } from '@nestjs/bull';
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
import { TicketModule } from './application/base/ticket/ticket.module';
import { SecurityToolsModule } from './application/base/security/security-tools/security-tools.module';
import { GroupModule } from './application/base/group/group.module';
import { PayAsYouGoModule } from './application/base/pay-as-you-go/pay-as-you-go.module';
import { ServicePropertiesModule } from './application/base/service-properties/service-properties.module';
import { VcloudWrapper } from './wrappers/vcloudWrapper/vcloudWrapper';
import { RobotModule } from './application/robot/robot.module';
import { PoliciesGuard } from './application/base/security/ability/guards/policies.guard';
import { RolesGuard } from './application/base/security/ability/guards/roles.guard';
// import { RavenInterceptor, RavenModule } from 'nest-raven';
// import { APP_INTERCEPTOR } from '@nestjs/core';
import { MainWrapperModule } from './wrappers/main-wrapper/main-wrapper.module';
import { TaskManagerModule } from './application/base/task-manager/task-manager.module';
import { BullModule as BullMQModule } from '@nestjs/bullmq';
import { UvdeskWrapperModule } from './wrappers/uvdesk-wrapper/uvdesk-wrapper.module';
import { DatacenterModule } from './application/base/datacenter/datacenter.module';
import { ServiceItemModule } from './application/base/service-item/service-item.module';
import { CompanyModule } from './application/base/company/company.module';
import { FileModule } from './application/base/file/file.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ClsModule } from 'nestjs-cls';
import { EntityLogModule } from './application/base/entity-log/entity-log.module';
import { BudgetingModule } from './application/base/budgeting/budgeting.module';
import { SentryInterceptor } from './infrastructure/logger/Interceptors/SentryInterceptor';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { i18nOptions } from './infrastructure/config/i18n-options';
import { I18nModule } from 'nestjs-i18n';
import { BaseExceptionModule } from './infrastructure/exceptions/base/base-exception.module';
import { ZammadWrapperModule } from './wrappers/zammad-wrapper/zammad-wrapper.module';
import { WrapperModule } from './wrappers/wrapper.module';

@Module({
  imports: [
    I18nModule.forRoot(i18nOptions),
    ClsModule.forRoot({
      global: true,
      guard: { mount: true },
      middleware: { mount: true },
      interceptor: { mount: true },
    }),
    CacheModule.register({ isGlobal: true }),
    // RavenModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 600,
      },
    ]),

    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),

    BullMQModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
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
    VcloudWrapper,
    MainWrapperModule,
    RobotModule,
    TaskManagerModule,
    UvdeskWrapperModule,
    DatacenterModule,
    ServiceItemModule,
    CompanyModule,
    FileModule,
    EntityLogModule,
    BudgetingModule,
    BaseExceptionModule,
    WrapperModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
    NetworkService,
    ApplicationPortProfileService,
    // EntitySubscriber,
  ],
  exports: [],
})
export class AppModule {}
