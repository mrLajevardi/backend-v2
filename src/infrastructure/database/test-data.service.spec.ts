import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TestDataService } from './test-data.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { TestDatabaseModule } from './test-database.module';
import { User } from './test-entities/User';
// Import other test entities...

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

describe('TestDataService', () => {
  let testDataService: TestDataService;
  let accessTokenRepository: Repository<AccessToken>;
  // Define other repository variables...

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [
            TestDatabaseModule,
            TypeOrmModule.forFeature([AccessToken,Acl,AiTransactionsLogs,Configs,Discounts,
                Groups,GroupsMapping,InvoiceDiscounts,InvoiceItems,
                InvoicePlans,InvoiceProperties,Invoices,
                ItemTypes,Migrations,MigrationsLock,
                Organization,PermissionGroups, PermissionGroupsMappings,
                PermissionMappings,Permissions,
                Plans, Role, RoleMapping, Scope, 
                ServiceInstances, ServiceItems, ServiceProperties,
                ServiceTypes, Sessions, Setting,
                SystemSettings, Tasks, Tickets,
                Transactions, User])
        ],

      providers: [
        TestDataService,
        
      ],
    }).compile();

    testDataService = module.get<TestDataService>(TestDataService);
    accessTokenRepository = module.get<Repository<AccessToken>>(
      getRepositoryToken(AccessToken)
    );
    // Initialize other repository variables...
  });

  describe('seedTestData', () => {
    it('should seed data for all tables', async () => {
      // Mock the seedTable function
      jest.spyOn(testDataService, 'seedTable').mockImplementation(async () => {
        // Mock implementation here if needed
      });

      await testDataService.seedTestData();

      // Assert that seedTable was called for each repository
      expect(testDataService.seedTable).toHaveBeenCalledWith(
        'access-token.json',
        accessTokenRepository
      );
      // Assert other seedTable calls...

      // Assert any other expectations as needed
    });
  });
});
