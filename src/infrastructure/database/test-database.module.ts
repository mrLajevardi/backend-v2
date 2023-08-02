/*
This module is responsible for proper loading of test database 
Importing this module in the test files is sufficient for loading the database for test purposes. 
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { dbTestEntities } from './entityImporter/orm-test-entities';
import { TestDataService } from './test-data.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigsTableService } from 'src/application/base/crud/configs-table/configs-table.service';
import { InvoiceItemsTableService } from 'src/application/base/crud/invoice-items-table/invoice-items-table.service';
import { InvoicePropertiesTableService } from 'src/application/base/crud/invoice-properties-table/invoice-properties-table.service';
import { ItemTypesTableService } from 'src/application/base/crud/item-types-table/item-types-table.service';
import { OrganizationTableService } from 'src/application/base/crud/organization-table/organization-table.service';
import { ServiceInstancesTableService } from 'src/application/base/crud/service-instances-table/service-instances-table.service';
import { ServiceItemsTableService } from 'src/application/base/crud/service-items-table/service-items-table.service';
import { ServicePropertiesTableService } from 'src/application/base/crud/service-properties-table/service-properties-table.service';
import { SessionsTableService } from 'src/application/base/crud/sessions-table/sessions-table.service';
import { TasksTableService } from 'src/application/base/crud/tasks-table/tasks-table.service';
import { TransactionsTableService } from 'src/application/base/crud/transactions-table/transactions-table.service';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { OrganizationService } from 'src/application/base/organization/organization.service';
import { PayAsYouGoService } from 'src/application/base/service/services/pay-as-you-go.service';
import { SessionsService } from 'src/application/base/sessions/sessions.service';
import { TaskManagerService } from 'src/application/base/tasks/service/task-manager.service';
import { TasksService } from 'src/application/base/tasks/service/tasks.service';
import { UserService } from 'src/application/base/user/service/user.service';
import { EdgeService } from 'src/application/vdc/service/edge.service';
import { NetworkService } from 'src/application/vdc/service/network.service';
import { OrgService } from 'src/application/vdc/service/org.service';
import { VdcService } from 'src/application/vdc/service/vdc.service';
import { VgpuService } from 'src/application/vgpu/vgpu.service';
import { BullModule } from '@nestjs/bull';
import { ServiceTypesTableService } from 'src/application/base/crud/service-types-table/service-types-table.service';
import { TransactionsService } from 'src/application/base/transactions/transactions.service';
import { DiscountsTableService } from 'src/application/base/crud/discounts-table/discounts-table.service';
import { PlansQueryService } from 'src/application/base/crud/plans-table/plans-query.service';
import { PlansTableService } from 'src/application/base/crud/plans-table/plans-table.service';
import { InvoicesChecksService } from 'src/application/base/invoice/service/invoices-checks.service';
import { DiscountsService } from 'src/application/base/service/services/discounts.service';
import { ServiceChecksService } from 'src/application/base/service/services/service-checks/service-checks.service';
import { ACLTableService } from 'src/application/base/crud/acl-table/acl-table.service';
import { InvoicePlansTableService } from 'src/application/base/crud/invoice-plans-table/invoice-plans-table.service';
import { InvoicesTableService } from 'src/application/base/crud/invoices-table/invoices-table.service';
import { CostCalculationService } from 'src/application/base/invoice/service/cost-calculation.service';
import { InvoicesService } from 'src/application/base/invoice/service/invoices.service';
import { ServiceService } from 'src/application/base/service/services/service.service';
import { InvoiceDiscountsTableService } from 'src/application/base/crud/invoice-discounts-table/invoice-discounts-table.service';
import { QualityPlansService } from 'src/application/base/crud/quality-plans/quality-plans.service';
import { ServiceItemsSumService } from 'src/application/base/crud/service-items-sum/service-items-sum.service';
import { CreateServiceService } from 'src/application/base/service/services/create-service.service';
import { ExtendServiceService } from 'src/application/base/service/services/extend-service.service';
import { LoggerService } from '../logger/logger.service';
import { ErrorLogTableService } from 'src/application/base/crud/error-log-table/error-log-table.service';
import { InfoLogTableService } from 'src/application/base/crud/info-log-table/info-log-table.service';
import { DebugLogTableService } from 'src/application/base/crud/debug-log-table/debug-log-table.service';
import { ApplicationPortProfileService } from 'src/application/edge-gateway/service/application-port-profile.service';
import { EdgeGatewayService } from 'src/application/edge-gateway/service/edge-gateway.service';
import { FirewallService } from 'src/application/edge-gateway/service/firewall.service';
import { DhcpService } from 'src/application/networks/dhcp.service';
import { ServicePlansTableService } from 'src/application/base/crud/service-plans-table/service-plans-table.service';
import { InvoiceItemListService } from 'src/application/base/crud/invoice-item-list/invoice-item-list.service';
import { NetworksService } from 'src/application/networks/networks.service';
import { RoleMappingTableService } from 'src/application/base/crud/role-mapping-table/role-mapping-table.service';
import { SystemSettingsTableService } from 'src/application/base/crud/system-settings-table/system-settings-table.service';
import { PaymentService } from 'src/application/payment/payment.service';
import { NotificationService } from 'src/application/base/notification/notification.service';
import { AuthService } from 'src/application/base/security/auth/service/auth.service';
import { OtpService } from 'src/application/base/security/security-tools/otp.service';
import { OauthService } from 'src/application/base/security/auth/service/oauth.service';
import { EmailService } from 'src/application/base/notification/email.service';
import { SmsService } from 'src/application/base/notification/sms.service';
import { EmailContentService } from 'src/application/base/notification/email-content.service';
import { ZarinpalService } from 'src/application/payment/zarinpal.service';
import { TicketService } from 'src/application/base/ticket/ticket.service';
import { AccessTokenTableService } from 'src/application/base/crud/access-token-table/access-token-table.service';
import { TicketsTableService } from 'src/application/base/crud/tickets-table/tickets-table.service';
import { NatService } from 'src/application/nat/nat.service';
import { VmService } from 'src/application/vm/service/vm.service';
import { SecurityToolsService } from 'src/application/base/security/security-tools/security-tools.service';
import { UserAdminService } from 'src/application/base/user/service/user-admin.service';
import { LoginService } from 'src/application/base/security/auth/service/login.service';
import { AbilityAdminService } from 'src/application/base/security/ability/service/ability-admin.service';
import { GroupsTableService } from 'src/application/base/crud/groups-table/groups-table.service';
import { GroupService } from 'src/application/base/group/group.service';
import { GroupsMappingTableService } from 'src/application/base/crud/groups-mapping-table/groups-mapping-table.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      autoLoadEntities: true,
      entities: dbTestEntities,
      synchronize: true,
    } as TypeOrmModuleOptions),
    TypeOrmModule.forFeature(dbTestEntities),
    BullModule.registerQueue({
      name: 'tasks',
    }),
  ],
  providers: [
    TestDataService,
    VgpuService,
    SessionsService,
    UserService,
    OrganizationService,
    ConfigsTableService,
    UserTableService,
    SessionsTableService,
    OrganizationTableService,
    JwtService,
    PayAsYouGoService,
    ServicePropertiesTableService,
    ItemTypesTableService,
    InvoiceItemsTableService,
    InvoicePropertiesTableService,
    TaskManagerService,
    TasksTableService,
    TransactionsTableService,
    ServiceInstancesTableService,
    TasksService,
    ServiceItemsTableService,
    EdgeService,
    OrgService,
    NetworkService,
    NetworksService,
    NatService,
    VdcService,
    ServiceTypesTableService,
    TransactionsService,
    InvoicesChecksService,
    PlansTableService,
    ServiceChecksService,
    DiscountsService,
    PlansQueryService,
    DiscountsTableService,
    ACLTableService,
    InvoicesService,
    CostCalculationService,
    InvoicePlansTableService,
    InvoicesTableService,
    ServiceService,
    CreateServiceService,
    QualityPlansService,
    ServiceItemsSumService,
    InvoiceDiscountsTableService,
    ExtendServiceService,
    LoggerService,
    ErrorLogTableService,
    InfoLogTableService,
    DebugLogTableService,
    EdgeGatewayService,
    FirewallService,
    ApplicationPortProfileService,
    DhcpService,
    ServicePlansTableService,
    RoleMappingTableService,
    SystemSettingsTableService,
    PaymentService,
    NotificationService,
    AuthService,
    OtpService,
    OauthService,
    EmailService,
    SmsService,
    EmailContentService,
    ZarinpalService,
    TicketService,
    AccessTokenTableService,
    TicketsTableService,
    InvoiceItemListService,
    VmService,
    SecurityToolsService,
    UserAdminService,
    LoginService,
    AbilityAdminService,
    GroupsTableService,
    GroupService,
    GroupsMappingTableService,
  ],
  exports: [
    TypeOrmModule,
    BullModule.registerQueue({
      name: 'tasks',
    }),
    VgpuService,
    SessionsService,
    UserService,
    OrganizationService,
    ConfigsTableService,
    UserTableService,
    SessionsTableService,
    OrganizationTableService,
    JwtService,
    PayAsYouGoService,
    ServicePropertiesTableService,
    ItemTypesTableService,
    InvoiceItemsTableService,
    InvoicePropertiesTableService,
    TaskManagerService,
    TasksTableService,
    TransactionsTableService,
    ServiceInstancesTableService,
    TasksService,
    ServiceItemsTableService,
    EdgeService,
    OrgService,
    NetworkService,
    NetworksService,
    NatService,
    VdcService,
    ServiceTypesTableService,
    TransactionsService,
    InvoicesChecksService,
    PlansTableService,
    ServiceChecksService,
    DiscountsService,
    PlansQueryService,
    DiscountsTableService,
    ACLTableService,
    InvoicesService,
    CostCalculationService,
    InvoicePlansTableService,
    InvoicesTableService,
    ServiceService,
    CreateServiceService,
    QualityPlansService,
    ServiceItemsSumService,
    InvoiceDiscountsTableService,
    ExtendServiceService,
    LoggerService,
    ErrorLogTableService,
    InfoLogTableService,
    DebugLogTableService,
    EdgeGatewayService,
    FirewallService,
    ApplicationPortProfileService,
    DhcpService,
    ServicePlansTableService,
    RoleMappingTableService,
    SystemSettingsTableService,
    PaymentService,
    NotificationService,
    AuthService,
    OtpService,
    OauthService,
    EmailService,
    SmsService,
    EmailContentService,
    ZarinpalService,
    TicketService,
    AccessTokenTableService,
    TicketsTableService,
    InvoiceItemListService,
    VmService,
    SecurityToolsService,
    UserAdminService,
    LoginService,
    AbilityAdminService,
    GroupsTableService,
    GroupService,
    GroupsMappingTableService,
    TasksService,
  ],
})
export class TestDatabaseModule {}
