import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './application/core/auth/guard/jwt-auth.guard';
import { UserModule } from './application/base/user/user.module';
import { VastModule } from './application/vast/vast.module';
import { AuthModule } from './application/core/auth/auth.module';
import { AclModule } from './application/base/acl/acl.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import configurations from './infrastructure/config/configurations';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from './application/ai/ai.module';
import { ServicePropertiesModule } from './application/base/service-properties/service-properties.module';
import { ServiceItemsModule } from './application/base/service-items/service-items.module';
import { ServiceInstancesModule } from './application/base/service-instances/service-instances.module';
import { ServiceTypesModule } from './application/base/service-types/service-types.module';
import { InvoicePropertiesModule } from './application/base/invoice-properties/invoice-properties.module';
import { AccessTokenModule } from './application/base/access-token/access-token.module';
import { AiTransactionsLogsModule } from './application/base/ai-transactions-logs/ai-transactions-logs.module';
import { ConfigsModule } from './application/base/configs/configs.module';
import { DebugLogModule } from './application/base/debug-log/debug-log.module';
import { DiscountsModule } from './application/base/discounts/discounts.module';
import { ErrorLogModule } from './application/base/error-log/error-log.module';
import { InvoiceDiscountsModule } from './application/base/invoice-discounts/invoice-discounts.module';
import { InvoiceItemsModule } from './application/base/invoice-items/invoice-items.module';
import { InvoicePlansModule } from './application/base/invoice-plans/invoice-plans.module';
import { InvoicesModule } from './application/base/invoices/invoices.module';
import { ItemTypesModule } from './application/base/item-types/item-types.module';
import { OrganizationModule } from './application/base/organization/organization.module';
import { PermissionGroupsModule } from './application/base/permission-groups/permission-groups.module';
import { PermissionGroupsMappingsModule } from './application/base/permission-groups-mappings/permission-groups-mappings.module';
import { PermissionMappingsModule } from './application/base/permission-mappings/permission-mappings.module';
import { PermissionsModule } from './application/base/permissions/permissions.module';
import { PlansModule } from './application/base/plans/plans.module';
import { RoleModule } from './application/base/role/role.module';
import { RoleMappingModule } from './application/base/role-mapping/role-mapping.module';
import { ScopeModule } from './application/base/scope/scope.module';
import { SessionsModule } from './application/base/sessions/sessions.module';
import { SettingModule } from './application/base/setting/setting.module';
import { SysdiagramsModule } from './application/base/sysdiagrams/sysdiagrams.module';
import { SystemSettingsModule } from './application/base/system-settings/system-settings.module';
import { TasksModule } from './application/base/tasks/tasks.module';
import { TicketsModule } from './application/base/tickets/tickets.module';
import { TransactionsModule } from './application/base/transactions/transactions.module';
import { AbilityModule } from './application/core/ability/ability.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configurations],
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
