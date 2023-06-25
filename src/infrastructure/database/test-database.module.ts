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
import { UserService } from 'src/application/base/user/user.service';
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
import { AbilityFactory } from 'nest-casl/dist/factories/ability.factory';
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
  ],
})
export class TestDatabaseModule {}
