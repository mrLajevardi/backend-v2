import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Groups } from './test-entities/Groups';
import { GroupsMapping } from './test-entities/GroupsMapping';
import { Invoices } from './test-entities/Invoices';
import { PermissionGroups } from './test-entities/PermissionGroups';
import { PermissionGroupsMappings } from './test-entities/PermissionGroupsMappings';
import { InvoiceDiscounts } from './test-entities/InvoiceDiscounts';
import { AccessToken } from './test-entities/AccessToken';
import { Acl } from './test-entities/Acl';
import { Permissions } from './test-entities/Permissions';
import { PermissionMappings } from './test-entities/PermissionMappings';
import { Configs } from './test-entities/Configs';
import { ServiceTypes } from './test-entities/ServiceTypes';
import { Scope } from './test-entities/Scope';
import { ServiceInstances } from './test-entities/ServiceInstances';
import { Setting } from './test-entities/Setting';
import { Discounts } from './test-entities/Discounts';
import { ServiceProperties } from './test-entities/ServiceProperties';
import { Plans } from './test-entities/Plans';
import { Tickets } from './test-entities/Tickets';
import { User } from './test-entities/User';
import { Role } from './test-entities/Role';
import { ServiceItems } from './test-entities/ServiceItems';
import { RoleMapping } from './test-entities/RoleMapping';
import { InvoiceItems } from './test-entities/InvoiceItems';
import { Organization } from './test-entities/Organization';
import { InvoicePlans } from './test-entities/InvoicePlans';
import { ItemTypes } from './test-entities/ItemTypes';
import { Sysdiagrams } from './test-entities/sysdiagrams';
import { Sessions } from './test-entities/Sessions';
import { InvoiceProperties } from './test-entities/InvoiceProperties';
import { SystemSettings } from './test-entities/SystemSettings';
import { InfoLog } from './test-entities/InfoLog';
import { Migrations } from './test-entities/Migrations';
import { AiTransactionsLogs } from './test-entities/AiTransactionsLogs';
import { ErrorLog } from './test-entities/ErrorLog';
import { DebugLog } from './test-entities/DebugLog';
import { Transactions } from './test-entities/Transactions';
import { Tasks } from './test-entities/Tasks';

import * as fs from 'fs';

@Injectable()
export class TestDataService {
  constructor(
    @InjectRepository(Groups)
    private readonly groupsRepository: Repository<Groups>,
    @InjectRepository(GroupsMapping)
    private readonly groupsMappingRepository: Repository<GroupsMapping>,
    @InjectRepository(Invoices)
    private readonly invoicesRepository: Repository<Invoices>,
    @InjectRepository(PermissionGroups)
    private readonly permissionGroupsRepository: Repository<PermissionGroups>,
    @InjectRepository(PermissionGroupsMappings)
    private readonly permissionGroupsMappingsRepository: Repository<PermissionGroupsMappings>,
    @InjectRepository(InvoiceDiscounts)
    private readonly invoiceDiscountsRepository: Repository<InvoiceDiscounts>,
    @InjectRepository(AccessToken)
    private readonly accessTokenRepository: Repository<AccessToken>,
    @InjectRepository(Acl)
    private readonly aCLRepository: Repository<Acl>,
    @InjectRepository(Permissions)
    private readonly permissionsRepository: Repository<Permissions>,
    @InjectRepository(PermissionMappings)
    private readonly permissionMappingsRepository: Repository<PermissionMappings>,
    @InjectRepository(Configs)
    private readonly configsRepository: Repository<Configs>,
    @InjectRepository(ServiceTypes)
    private readonly serviceTypesRepository: Repository<ServiceTypes>,
    @InjectRepository(Scope)
    private readonly scopeRepository: Repository<Scope>,
    @InjectRepository(ServiceInstances)
    private readonly serviceInstancesRepository: Repository<ServiceInstances>,
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    @InjectRepository(Discounts)
    private readonly discountsRepository: Repository<Discounts>,
    @InjectRepository(ServiceProperties)
    private readonly servicePropertiesRepository: Repository<ServiceProperties>,
    @InjectRepository(Plans)
    private readonly plansRepository: Repository<Plans>,
    @InjectRepository(Tickets)
    private readonly ticketsRepository: Repository<Tickets>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(ServiceItems)
    private readonly serviceItemsRepository: Repository<ServiceItems>,
    @InjectRepository(RoleMapping)
    private readonly roleMappingRepository: Repository<RoleMapping>,
    @InjectRepository(InvoiceItems)
    private readonly invoiceItemsRepository: Repository<InvoiceItems>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(InvoicePlans)
    private readonly invoicePlansRepository: Repository<InvoicePlans>,
    @InjectRepository(ItemTypes)
    private readonly itemTypesRepository: Repository<ItemTypes>,
    @InjectRepository(Sysdiagrams)
    private readonly sysdiagramsRepository: Repository<Sysdiagrams>,
    @InjectRepository(Sessions)
    private readonly sessionsRepository: Repository<Sessions>,
    @InjectRepository(InvoiceProperties)
    private readonly invoicePropertiesRepository: Repository<InvoiceProperties>,
    @InjectRepository(SystemSettings)
    private readonly systemSettingsRepository: Repository<SystemSettings>,
    @InjectRepository(InfoLog)
    private readonly infoLogRepository: Repository<InfoLog>,
    @InjectRepository(Migrations)
    private readonly migrationsRepository: Repository<Migrations>,
    @InjectRepository(AiTransactionsLogs)
    private readonly aiTransactionsLogsRepository: Repository<AiTransactionsLogs>,
    @InjectRepository(ErrorLog)
    private readonly errorLogRepository: Repository<ErrorLog>,
    @InjectRepository(DebugLog)
    private readonly debugLogRepository: Repository<DebugLog>,
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
    @InjectRepository(Tasks)
    private readonly tasksRepository: Repository<Tasks>,
  ) {}

  async seedTable<T>(
    filename: string,
    repository: Repository<T>,
  ): Promise<void> {
    // console.log("seeding table ",filename);
    const path = 'src/infrastructure/database/test-seeds/' + filename;
    const jsonData = fs.readFileSync(path, 'utf8');
    const items = JSON.parse(jsonData);
    for (const item of items) {
      const entity = item as T;
      // console.log("inserting ... ", entity);
      await repository.save(entity);
    }
  }

  async seedTestData(): Promise<void> {
    await this.seedTable('groups.json', this.groupsRepository);
    await this.seedTable('groups-mapping.json', this.groupsMappingRepository);
    await this.seedTable('invoices.json', this.invoicesRepository);
    await this.seedTable(
      'permission-groups.json',
      this.permissionGroupsRepository,
    );
    await this.seedTable(
      'permission-groups-mappings.json',
      this.permissionGroupsMappingsRepository,
    );
    await this.seedTable(
      'invoice-discounts.json',
      this.invoiceDiscountsRepository,
    );
    await this.seedTable('access-token.json', this.accessTokenRepository);
    await this.seedTable('acl.json', this.aCLRepository);
    await this.seedTable('permissions.json', this.permissionsRepository);
    await this.seedTable(
      'permission-mappings.json',
      this.permissionMappingsRepository,
    );
    await this.seedTable('configs.json', this.configsRepository);
    await this.seedTable('service-types.json', this.serviceTypesRepository);
    await this.seedTable('scope.json', this.scopeRepository);
    await this.seedTable(
      'service-instances.json',
      this.serviceInstancesRepository,
    );
    await this.seedTable('setting.json', this.settingRepository);
    await this.seedTable('discounts.json', this.discountsRepository);
    await this.seedTable(
      'service-properties.json',
      this.servicePropertiesRepository,
    );
    await this.seedTable('plans.json', this.plansRepository);
    await this.seedTable('tickets.json', this.ticketsRepository);
    await this.seedTable('user.json', this.userRepository);
    await this.seedTable('role.json', this.roleRepository);
    await this.seedTable('service-items.json', this.serviceItemsRepository);
    await this.seedTable('role-mapping.json', this.roleMappingRepository);
    await this.seedTable('invoice-items.json', this.invoiceItemsRepository);
    await this.seedTable('organization.json', this.organizationRepository);
    await this.seedTable('invoice-plans.json', this.invoicePlansRepository);
    await this.seedTable('item-types.json', this.itemTypesRepository);
    await this.seedTable('sysdiagrams.json', this.sysdiagramsRepository);
    await this.seedTable('sessions.json', this.sessionsRepository);
    await this.seedTable(
      'invoice-properties.json',
      this.invoicePropertiesRepository,
    );
    await this.seedTable('system-settings.json', this.systemSettingsRepository);
    await this.seedTable('info-log.json', this.infoLogRepository);
    await this.seedTable('migrations.json', this.migrationsRepository);
    await this.seedTable(
      'ai-transactions-logs.json',
      this.aiTransactionsLogsRepository,
    );
    await this.seedTable('error-log.json', this.errorLogRepository);
    await this.seedTable('debug-log.json', this.debugLogRepository);
    await this.seedTable('transactions.json', this.transactionsRepository);
    await this.seedTable('tasks.json', this.tasksRepository);
  }
}
