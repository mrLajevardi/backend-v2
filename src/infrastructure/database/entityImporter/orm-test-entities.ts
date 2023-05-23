/*
This is for laodiing all of entities in an array at once
this helps us preventing cluttered app module. 
This is for Test purposes. 
*/


import { GroupsMapping } from '../test-entities/GroupsMapping';
import { AccessToken } from '../test-entities/AccessToken';
import { Acl } from '../test-entities/Acl';
import { AiTransactionsLogs } from '../test-entities/AiTransactionsLogs';
import { Configs } from '../test-entities/Configs';
import { Discounts } from '../test-entities/Discounts';
import { Groups } from '../test-entities/Groups';
import { InvoiceDiscounts } from '../test-entities/InvoiceDiscounts';
import { InvoiceItems } from '../test-entities/InvoiceItems';
import { InvoicePlans } from '../test-entities/InvoicePlans';
import { InvoiceProperties } from '../test-entities/InvoiceProperties';
import { Invoices } from '../test-entities/Invoices';
import { ItemTypes } from '../test-entities/ItemTypes';
import { MigrationsLock } from '../test-entities/MigrationsLock';
import { Migrations } from '../test-entities/Migrations';
import { Organization } from '../test-entities/Organization';
import { PermissionGroups } from '../test-entities/PermissionGroups';
import { PermissionGroupsMappings } from '../test-entities/PermissionGroupsMappings';
import { PermissionMappings } from '../test-entities/PermissionMappings';
import { Permissions } from '../test-entities/Permissions';
import { Plans } from '../test-entities/Plans';
import { Role } from '../test-entities/Role';
import { RoleMapping } from '../test-entities/RoleMapping';
import { Scope } from '@nestjs/common';
import { ServiceInstances } from '../test-entities/ServiceInstances';
import { ServiceItems } from '../test-entities/ServiceItems';
import { ServiceProperties } from '../test-entities/ServiceProperties';
import { ServiceTypes } from '../test-entities/ServiceTypes';
import { Sessions } from '../test-entities/Sessions';
import { Setting } from '../test-entities/Setting';
import { SystemSettings } from '../test-entities/SystemSettings';
import { Tasks } from '../test-entities/Tasks';
import { Tickets } from '../test-entities/Tickets';
import { Transactions } from '../test-entities/Transactions';
import { User } from '../test-entities/User';

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