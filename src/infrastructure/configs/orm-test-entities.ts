import { GroupsMapping } from '../db/test-entities/GroupsMapping';
import { AccessToken } from '../db/test-entities/AccessToken';
import { Acl } from '../db/test-entities/Acl';
import { AiTransactionsLogs } from '../db/test-entities/AiTransactionsLogs';
import { Configs } from '../db/test-entities/Configs';
import { Discounts } from '../db/test-entities/Discounts';
import { Groups } from '../db/test-entities/Groups';
import { InvoiceDiscounts } from '../db/test-entities/InvoiceDiscounts';
import { InvoiceItems } from '../db/test-entities/InvoiceItems';
import { InvoicePlans } from '../db/test-entities/InvoicePlans';
import { InvoiceProperties } from '../db/test-entities/InvoiceProperties';
import { Invoices } from '../db/test-entities/Invoices';
import { ItemTypes } from '../db/test-entities/ItemTypes';
import { MigrationsLock } from '../db/test-entities/MigrationsLock';
import { Migrations } from '../db/test-entities/Migrations';
import { Organization } from '../db/test-entities/Organization';
import { PermissionGroups } from '../db/test-entities/PermissionGroups';
import { PermissionGroupsMappings } from '../db/test-entities/PermissionGroupsMappings';
import { PermissionMappings } from '../db/test-entities/PermissionMappings';
import { Permissions } from '../db/test-entities/Permissions';
import { Plans } from '../db/test-entities/Plans';
import { Role } from '../db/test-entities/Role';
import { RoleMapping } from '../db/test-entities/RoleMapping';
import { Scope } from '@nestjs/common';
import { ServiceInstances } from '../db/test-entities/ServiceInstances';
import { ServiceItems } from '../db/test-entities/ServiceItems';
import { ServiceProperties } from '../db/test-entities/ServiceProperties';
import { ServiceTypes } from '../db/test-entities/ServiceTypes';
import { Sessions } from '../db/test-entities/Sessions';
import { Setting } from '../db/test-entities/Setting';
import { SystemSettings } from '../db/test-entities/SystemSettings';
import { Tasks } from '../db/test-entities/Tasks';
import { Tickets } from '../db/test-entities/Tickets';
import { Transactions } from '../db/test-entities/Transactions';
import { User } from '../db/test-entities/User';

export const dbTestEntities = [
    AccessToken,Acl,AiTransactionsLogs,Configs,Discounts,
    Groups,GroupsMapping,InvoiceDiscounts,InvoiceItems,
    InvoicePlans,InvoiceProperties,Invoices,
    ItemTypes,Migrations,MigrationsLock,
    Organization,PermissionGroups, PermissionGroupsMappings,
    PermissionMappings,Permissions,
    Plans, Role, RoleMapping, Scope, 
    ServiceInstances, ServiceItems, ServiceProperties,
    ServiceTypes, Sessions, Setting,
    SystemSettings, Tasks, Tickets,
    Transactions, User
  ];