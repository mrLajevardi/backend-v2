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

@Injectable()
export class SeedTestService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
    @InjectRepository(Tickets)
    private readonly ticketsRepository: Repository<Tickets>,
    @InjectRepository(Tasks)
    private readonly tasksRepository: Repository<Tasks>,
    @InjectRepository(SystemSettings)
    private readonly systemSettingsRepository: Repository<SystemSettings>,
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    @InjectRepository(Sessions)
    private readonly sessionsRepository: Repository<Sessions>,
    @InjectRepository(ServiceTypes)
    private readonly serviceTypesRepository: Repository<ServiceTypes>,
    @InjectRepository(ServiceProperties)
    private readonly servicePropertiesRepository: Repository<ServiceProperties>,
    @InjectRepository(ServiceItems)
    private readonly serviceItemsRepository: Repository<ServiceItems>,
    @InjectRepository(ServiceInstances)
    private readonly serviceInstancesRepository: Repository<ServiceInstances>,
    @InjectRepository(RoleMapping)
    private readonly roleMappingRepository: Repository<RoleMapping>,
    @InjectRepository(Scope)
    private readonly scopeRepository: Repository<Scope>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Plans)
    private readonly plansRepository: Repository<Plans>,
    @InjectRepository(Permissions)
    private readonly permissionsRepository: Repository<Permissions>,
    @InjectRepository(PermissionMappings)
    private readonly permissionMappingsRepository: Repository<PermissionMappings>,
    @InjectRepository(PermissionGroupsMappings)
    private readonly permissionGroupsMappingsRepository: Repository<PermissionGroupsMappings>,
    @InjectRepository(PermissionGroups)
    private readonly permissionGroupsRepository: Repository<PermissionGroups>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Migrations)
    private readonly migrationsRepository: Repository<Migrations>,
    @InjectRepository(MigrationsLock)
    private readonly migrationsLockRepository: Repository<MigrationsLock>,
    @InjectRepository(ItemTypes)
    private readonly itemTypesRepository: Repository<ItemTypes>,
    @InjectRepository(Invoices)
    private readonly invoicesRepository: Repository<Invoices>,
    @InjectRepository(InvoiceProperties)
    private readonly invoicePropertiesRepository: Repository<InvoiceProperties>,
    @InjectRepository(InvoicePlans)
    private readonly invoicePlansRepository: Repository<InvoicePlans>,
    @InjectRepository(InvoiceItems)
    private readonly invoiceItemsRepository: Repository<InvoiceItems>,
    @InjectRepository(InvoiceDiscounts)
    private readonly invoiceDiscountsRepository: Repository<InvoiceDiscounts>,
    @InjectRepository(Groups)
    private readonly groupsRepository: Repository<Groups>,
    @InjectRepository(Discounts)
    private readonly discountsRepository: Repository<Discounts>,
    @InjectRepository(Configs)
    private readonly configsRepository: Repository<Configs>,
    @InjectRepository(AiTransactionsLogs)
    private readonly aiTransactionsLogsRepository: Repository<AiTransactionsLogs>,
    @InjectRepository(Acl)
    private readonly aclRepository: Repository<Acl>,
    @InjectRepository(AccessToken)
    private readonly accessTokenRepository: Repository<AccessToken>,
    @InjectRepository(GroupsMapping)
    private readonly groupsMappingRepository: Repository<GroupsMapping>,
 
  ) {}

  async seedUsers(): Promise<void> { 
    const filePath = 'test-seeds/users.json';
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const users = JSON.parse(jsonData);
    for (const user of users) {
      const entity = new User();
      entity.name = user.name;
      entity.email = user.email;
      await this.userRepository.save(entity);
    }
  }
}
