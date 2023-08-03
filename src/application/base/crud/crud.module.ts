import { Module } from '@nestjs/common';
import { AccessTokenTableModule } from './access-token-table/access-token-table.module';
import { ACLTableModule } from './acl-table/acl-table.module';
import { AITransactionsLogsTableModule } from './aitransactions-logs-table/aitransactions-logs-table.module';
import { ConfigsTableModule } from './configs-table/configs-table.module';
import { DebugLogTableModule } from './debug-log-table/debug-log-table.module';
import { DiscountsTableModule } from './discounts-table/discounts-table.module';
import { ErrorLogTableModule } from './error-log-table/error-log-table.module';
import { GroupsMappingTableModule } from './groups-mapping-table/groups-mapping-table.module';
import { GroupsTableModule } from './groups-table/groups-table.module';
import { InfoLogTableModule } from './info-log-table/info-log-table.module';
import { InvoiceDiscountsTableModule } from './invoice-discounts-table/invoice-discounts-table.module';
import { InvoiceItemsTableModule } from './invoice-items-table/invoice-items-table.module';
import { InvoicePlansTableModule } from './invoice-plans-table/invoice-plans-table.module';
import { InvoicePropertiesTableModule } from './invoice-properties-table/invoice-properties-table.module';
import { InvoicesTableModule } from './invoices-table/invoices-table.module';
import { ItemTypesTableModule } from './item-types-table/item-types-table.module';
import { OrganizationTableModule } from './organization-table/organization-table.module';
import { PermissionGroupsMappingsTableModule } from './permission-groups-mappings-table/permission-groups-mappings-table.module';
import { PermissionGroupsTableModule } from './permission-groups-table/permission-groups-table.module';
import { PermissionMappingsTableModule } from './permission-mappings-table/permission-mappings-table.module';
import { PermissionsTableModule } from './permissions-table/permissions-table.module';
import { PlansTableModule } from './plans-table/plans-table.module';
import { RoleMappingTableModule } from './role-mapping-table/role-mapping-table.module';
import { RoleTableModule } from './role-table/role-table.module';
import { ScopeTableModule } from './scope-table/scope-table.module';
import { ServiceInstancesTableModule } from './service-instances-table/service-instances-table.module';
import { ServiceItemsTableModule } from './service-items-table/service-items-table.module';
import { ServicePropertiesTableModule } from './service-properties-table/service-properties-table.module';
import { ServiceTypesTableModule } from './service-types-table/service-types-table.module';
import { SessionsTableModule } from './sessions-table/sessions-table.module';
import { SettingTableModule } from './setting-table/setting-table.module';
import { sysdiagramsTableModule } from './sysdiagrams-table/sysdiagrams-table.module';
import { SystemSettingsTableModule } from './system-settings-table/system-settings-table.module';
import { TasksTableModule } from './tasks-table/tasks-table.module';
import { TicketsTableModule } from './tickets-table/tickets-table.module';
import { TransactionsTableModule } from './transactions-table/transactions-table.module';
import { UserTableModule } from './user-table/user-table.module';
import { QualityPlansModule } from './quality-plans/quality-plans.module';
import { ServiceItemsSumModule } from './service-items-sum/service-items-sum.module';
import { ServicePlansTableModule } from './service-plans-table/service-plans-table.module';
import { InvoiceItemListModule } from './invoice-item-list/invoice-item-list.module';
import { ServiceReportsViewModule } from './service-reports-view/service-reports-view.module';

@Module({
  imports: [
    AccessTokenTableModule,
    ACLTableModule,
    AITransactionsLogsTableModule,
    ConfigsTableModule,
    DebugLogTableModule,
    DiscountsTableModule,
    ErrorLogTableModule,
    GroupsMappingTableModule,
    GroupsTableModule,
    InfoLogTableModule,
    InvoiceDiscountsTableModule,
    InvoiceDiscountsTableModule,
    InvoiceItemsTableModule,
    InvoicePlansTableModule,
    InvoicePropertiesTableModule,
    InvoicesTableModule,
    ItemTypesTableModule,
    OrganizationTableModule,
    PermissionGroupsMappingsTableModule,
    PermissionGroupsTableModule,
    PermissionMappingsTableModule,
    PermissionsTableModule,
    PlansTableModule,
    RoleMappingTableModule,
    RoleTableModule,
    ScopeTableModule,
    ServiceInstancesTableModule,
    ServiceItemsTableModule,
    ServicePropertiesTableModule,
    ServiceTypesTableModule,
    SessionsTableModule,
    SettingTableModule,
    sysdiagramsTableModule,
    SystemSettingsTableModule,
    TasksTableModule,
    TicketsTableModule,
    TransactionsTableModule,
    UserTableModule,
    QualityPlansModule,
    ServiceItemsSumModule,
    ServicePlansTableModule,
    InvoiceItemListModule,
    ServiceReportsViewModule,
  ],
  exports: [
    AccessTokenTableModule,
    ACLTableModule,
    AITransactionsLogsTableModule,
    ConfigsTableModule,
    DebugLogTableModule,
    DiscountsTableModule,
    ErrorLogTableModule,
    GroupsMappingTableModule,
    GroupsTableModule,
    InfoLogTableModule,
    InvoiceDiscountsTableModule,
    InvoiceDiscountsTableModule,
    InvoiceItemsTableModule,
    InvoicePlansTableModule,
    InvoicePropertiesTableModule,
    InvoicesTableModule,
    ItemTypesTableModule,
    OrganizationTableModule,
    PermissionGroupsMappingsTableModule,
    PermissionGroupsTableModule,
    PermissionMappingsTableModule,
    PermissionsTableModule,
    PlansTableModule,
    RoleMappingTableModule,
    RoleTableModule,
    ScopeTableModule,
    ServiceInstancesTableModule,
    ServiceItemsTableModule,
    ServicePropertiesTableModule,
    ServiceTypesTableModule,
    SessionsTableModule,
    SettingTableModule,
    sysdiagramsTableModule,
    SystemSettingsTableModule,
    TasksTableModule,
    TicketsTableModule,
    TransactionsTableModule,
    UserTableModule,
    QualityPlansModule,
    ServiceItemsSumModule,
    ServicePlansTableModule,
    InvoiceItemListModule,
    ServiceReportsViewModule,
  ],
})
export class CrudModule {}
