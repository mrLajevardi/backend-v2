import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GroupsMapping } from './test-entities/GroupsMapping';
import { AccessToken } from './test-entities/AccessToken';
import { Acl } from './test-entities/Acl';
import { AiTransactionsLogs } from './test-entities/AiTransactionsLogs';
import { Configs } from './test-entities/Configs';
import { Discounts } from './test-entities/Discounts';
import { Groups } from './test-entities/Groups';
import { InvoiceDiscounts } from './test-entities/InvoiceDiscounts';
import { InvoiceItems } from './test-entities/InvoiceItems';
import { InvoicePlans } from './test-entities/InvoicePlans';
import { InvoiceProperties } from './test-entities/InvoiceProperties';
import { Invoices } from './test-entities/Invoices';
import { ItemTypes } from './test-entities/ItemTypes';
import { MigrationsLock } from './test-entities/MigrationsLock';
import { Migrations } from './test-entities/Migrations';
import { Organization } from './test-entities/Organization';
import { PermissionGroups } from './test-entities/PermissionGroups';
import { PermissionGroupsMappings } from './test-entities/PermissionGroupsMappings';
import { PermissionMappings } from './test-entities/PermissionMappings';
import { Permissions } from './test-entities/Permissions';
import { Plans } from './test-entities/Plans';
import { Role } from './test-entities/Role';
import { RoleMapping } from './test-entities/RoleMapping';
import { Scope } from './test-entities/Scope';
import { ServiceInstances } from './test-entities/ServiceInstances';
import { ServiceItems } from './test-entities/ServiceItems';
import { ServiceProperties } from './test-entities/ServiceProperties';
import { ServiceTypes } from './test-entities/ServiceTypes';
import { Sessions } from './test-entities/Sessions';
import { Setting } from './test-entities/Setting';
import { SystemSettings } from './test-entities/SystemSettings';
import { Tasks } from './test-entities/Tasks';
import { Tickets } from './test-entities/Tickets';
import { Transactions } from './test-entities/Transactions';
import { User } from './test-entities/User';

import * as fs from 'fs';
import { dbTestEntities } from './entityImporter/orm-test-entities';
import { DebugLog } from './test-entities/DebugLog';
import { InfoLog } from './test-entities/InfoLog';
import { ErrorLog } from './test-entities/ErrorLog';

@Injectable()
export class TestDataService {
  constructor(
   // Logs Schema
  @InjectRepository(DebugLog)
  private readonly debugLogRepository: Repository<DebugLog>,

  @InjectRepository(InfoLog)
  private readonly infoLogRepository: Repository<InfoLog>,

  @InjectRepository(ErrorLog)
  private readonly errorLogRepository: Repository<ErrorLog>,

  // Security Schema
  @InjectRepository(AccessToken)
  private readonly accessTokenRepository: Repository<AccessToken>,

  @InjectRepository(Acl)
  private readonly aclRepository: Repository<Acl>,

  @InjectRepository(Migrations)
  private readonly migrationsRepository: Repository<Migrations>,

  @InjectRepository(MigrationsLock)
  private readonly migrationsLockRepository: Repository<MigrationsLock>,

  @InjectRepository(PermissionGroups)
  private readonly permissionGroupsRepository: Repository<PermissionGroups>,

  @InjectRepository(PermissionGroupsMappings)
  private readonly permissionGroupsMappingsRepository: Repository<PermissionGroupsMappings>,

  @InjectRepository(PermissionMappings)
  private readonly permissionMappingsRepository: Repository<PermissionMappings>,

  @InjectRepository(Permissions)
  private readonly permissionsRepository: Repository<Permissions>,

  @InjectRepository(Role)
  private readonly roleRepository: Repository<Role>,

  @InjectRepository(RoleMapping)
  private readonly roleMappingRepository: Repository<RoleMapping>,

  @InjectRepository(Scope)
  private readonly scopeRepository: Repository<Scope>,

  @InjectRepository(Setting)
  private readonly settingRepository: Repository<Setting>,

  @InjectRepository(SystemSettings)
  private readonly systemSettingsRepository: Repository<SystemSettings>,

  @InjectRepository(User)
  private readonly userRepository: Repository<User>,

  // Services Schema
  @InjectRepository(Configs)
  private readonly configsRepository: Repository<Configs>,

  @InjectRepository(Discounts)
  private readonly discountsRepository: Repository<Discounts>,

  @InjectRepository(ItemTypes)
  private readonly itemTypesRepository: Repository<ItemTypes>,

  @InjectRepository(Plans)
  private readonly plansRepository: Repository<Plans>,

  @InjectRepository(ServiceTypes)
  private readonly serviceTypesRepository: Repository<ServiceTypes>,

  // VDC Schema
  @InjectRepository(Organization)
  private readonly organizationRepository: Repository<Organization>,

  @InjectRepository(Sessions)
  private readonly sessionsRepository: Repository<Sessions>,

  // User Schema
  @InjectRepository(AiTransactionsLogs)
  private readonly aiTransactionsLogsRepository: Repository<AiTransactionsLogs>,

  @InjectRepository(Groups)
  private readonly groupsRepository: Repository<Groups>,

  @InjectRepository(GroupsMapping)
  private readonly groupsMappingRepository: Repository<GroupsMapping>,

  @InjectRepository(InvoiceDiscounts)
  private readonly invoiceDiscountsRepository: Repository<InvoiceDiscounts>,

  @InjectRepository(InvoiceItems)
  private readonly invoiceItemsRepository: Repository<InvoiceItems>,

  @InjectRepository(InvoicePlans)
  private readonly invoicePlansRepository: Repository<InvoicePlans>,

  @InjectRepository(InvoiceProperties)
  private readonly invoicePropertiesRepository: Repository<InvoiceProperties>,

  @InjectRepository(Invoices)
  private readonly invoicesRepository: Repository<Invoices>,

  @InjectRepository(ServiceInstances)
  private readonly serviceInstancesRepository: Repository<ServiceInstances>,

  @InjectRepository(ServiceItems)
  private readonly serviceItemsRepository: Repository<ServiceItems>,

  @InjectRepository(ServiceProperties)
  private readonly servicePropertiesRepository: Repository<ServiceProperties>,

  @InjectRepository(Tasks)
  private readonly tasksRepository: Repository<Tasks>,

  @InjectRepository(Tickets)
  private readonly ticketsRepository: Repository<Tickets>,

  @InjectRepository(Transactions)
  private readonly transactionsRepository: Repository<Transactions>,
 
) {}

  async seedTable<T>(filename: string, repository: Repository<T>): Promise<void> { 
    console.log("seeding table ",filename);
    const path = "src/infrastructure/database/test-seeds/" + filename;
    const jsonData = fs.readFileSync(path, 'utf8');
    const items = JSON.parse(jsonData);
    for (const item of items) {
      const entity = item as T; 
      console.log("inserting ... ", entity);
      const savedItem = await repository.save(entity);
    }
  }

  async seedTestData() : Promise<void> {
    await this.seedTable('access-token.json', this.accessTokenRepository);
    await this.seedTable('acl.json', this.aclRepository);
    await this.seedTable('ai-transaction-logs.json', this.aiTransactionsLogsRepository);
    await this.seedTable('config.json', this.configsRepository);
    await this.seedTable('discounts.json', this.discountsRepository);
    await this.seedTable('group-mapping.json', this.groupsMappingRepository);
    await this.seedTable('groups.json', this.groupsRepository);

    await this.seedTable('item-types.json', this.itemTypesRepository);
    await this.seedTable('migrations.json', this.migrationsRepository);
    await this.seedTable('organization.json', this.organizationRepository);
    await this.seedTable('permission-groups.json', this.permissionGroupsRepository);
    await this.seedTable('permission-groups-mappings.json', this.permissionGroupsMappingsRepository);
    await this.seedTable('permission-mappings.json', this.permissionMappingsRepository);
    await this.seedTable('permissions.json', this.permissionsRepository);
    await this.seedTable('plans.json', this.plansRepository);
    await this.seedTable('role.json', this.roleRepository);
    await this.seedTable('role-mapping.json', this.roleMappingRepository);
    await this.seedTable('scope.json', this.scopeRepository);
    await this.seedTable('service-instances.json', this.serviceInstancesRepository);
    await this.seedTable('service-items.json', this.serviceItemsRepository);    
    await this.seedTable('service-types.json', this.serviceTypesRepository);

    await this.seedTable('service-properties.json', this.servicePropertiesRepository);

    await this.seedTable('sessions.json', this.sessionsRepository);
    await this.seedTable('setting.json', this.settingRepository);
    await this.seedTable('system-settings.json', this.systemSettingsRepository);
    await this.seedTable('tasks.json', this.tasksRepository);
    await this.seedTable('tickets.json', this.ticketsRepository);
    await this.seedTable('transactions.json', this.transactionsRepository);
    await this.seedTable('user.json', this.userRepository);

    await this.seedTable('invoice-discounts.json', this.invoiceDiscountsRepository);
    await this.seedTable('invoice-items.json', this.invoiceItemsRepository);
    await this.seedTable('invoice-plans.json', this.invoicePlansRepository);
    await this.seedTable('invoice-properties.json', this.invoicePropertiesRepository);
    await this.seedTable('invoices.json', this.invoicesRepository);

  }
}
