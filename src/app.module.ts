import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './application/base/security/auth/guard/jwt-auth.guard';
import { UserModule } from './application/base/user/user/user.module';
import { VastModule } from './application/vast/vast.module';
import { AuthModule } from './application/base/security/auth/auth.module';
import { AclModule } from './application/base/security/acl/acl.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import configurations from './infrastructure/config/configurations';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from './application/ai/ai.module';
import { ServicePropertiesModule } from './application/base/service/service-properties/service-properties.module';
import { ServiceItemsModule } from './application/base/service/service-items/service-items.module';
import { ServiceInstancesModule } from './application/base/service/service-instances/service-instances.module';
import { ServiceTypesModule } from './application/base/service/service-types/service-types.module';
import { InvoicePropertiesModule } from './application/base/invoice/invoice-properties/invoice-properties.module';
import { AccessTokenModule } from './application/base/security/access-token/access-token.module';
import { AiTransactionsLogsModule } from './application/base/log/ai-transactions-logs/ai-transactions-logs.module';
import { ConfigsModule } from './application/base/service/configs/configs.module';
import { DebugLogModule } from './application/base/log/debug-log/debug-log.module';
import { DiscountsModule } from './application/base/service/discounts/discounts.module';
import { ErrorLogModule } from './application/base/log/error-log/error-log.module';
import { InvoiceDiscountsModule } from './application/base/invoice/invoice-discounts/invoice-discounts.module';
import { InvoiceItemsModule } from './application/base/invoice/invoice-items/invoice-items.module';
import { InvoicePlansModule } from './application/base/invoice/invoice-plans/invoice-plans.module';
import { InvoicesModule } from './application/base/invoice/invoices/invoices.module';
import { ItemTypesModule } from './application/base/service/item-types/item-types.module';
import { OrganizationModule } from './application/base/organization/organization.module';
import { PermissionGroupsModule } from './application/base/security/permission-groups/permission-groups.module';
import { PermissionGroupsMappingsModule } from './application/base/security/permission-groups-mappings/permission-groups-mappings.module';
import { PermissionMappingsModule } from './application/base/security/permission-mappings/permission-mappings.module';
import { PermissionsModule } from './application/base/security/permissions/permissions.module';
import { PlansModule } from './application/base/plans/plans.module';
import { RoleModule } from './application/base/security/role/role.module';
import { RoleMappingModule } from './application/base/security/role-mapping/role-mapping.module';
import { ScopeModule } from './application/base/scope/scope.module';
import { SessionsModule } from './application/base/sessions/sessions.module';
import { SettingModule } from './application/base/security/setting/setting.module';
import { SysdiagramsModule } from './application/base/sysdiagrams/sysdiagrams.module';
import { SystemSettingsModule } from './application/base/security/system-settings/system-settings.module';
import { TasksModule } from './application/base/tasks/tasks.module';
import { TicketsModule } from './application/base/tickets/tickets.module';
import { TransactionsModule } from './application/base/transactions/transactions.module';
import { AbilityModule } from './application/base/security/ability/ability.module';
import { BullModule, BullQueueEvents } from '@nestjs/bull';
import { VdcModule } from './application/vdc/vdc.module';
import { NetworkService } from './application/vdc/service/network.service';

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
    // tables
    UserModule,
    AclModule,
    AccessTokenModule,
    AiTransactionsLogsModule,
    ConfigsModule,
    DebugLogModule,
    DiscountsModule,
    ErrorLogModule,
    InvoiceDiscountsModule,
    InvoiceItemsModule,
    InvoicePlansModule,
    InvoicePropertiesModule,
    InvoicesModule,
    ItemTypesModule,
    OrganizationModule,
    PermissionGroupsModule,
    PermissionGroupsMappingsModule,
    PermissionMappingsModule,
    PermissionsModule,
    PlansModule,
    RoleModule,
    RoleMappingModule,
    ScopeModule,
    ServiceInstancesModule,
    ServiceItemsModule,
    ServicePropertiesModule,
    ServiceTypesModule,
    SessionsModule,
    SettingModule,
    SysdiagramsModule,
    SystemSettingsModule,
    TasksModule,
    TicketsModule,
    TransactionsModule,
    //core
    AuthModule,
    AiModule,
    VastModule,
    AbilityModule,
    VdcModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    NetworkService,
  ],
  exports: [],
})
export class AppModule {}
