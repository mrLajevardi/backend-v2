/*
This is for laodiing all of entities in an array at once
this helps us preventing cluttered app module. 
*/


import { GroupsMapping } from '../entities/GroupsMapping';
import { AccessToken } from '../entities/AccessToken';
import { Acl } from '../entities/Acl';
import { AiTransactionsLogs } from '../entities/AiTransactionsLogs';
import { Configs } from '../entities/Configs';
import { Discounts } from '../entities/Discounts';
import { Groups } from '../entities/Groups';
import { InvoiceDiscounts } from '../entities/InvoiceDiscounts';
import { InvoiceItems } from '../entities/InvoiceItems';
import { InvoicePlans } from '../entities/InvoicePlans';
import { InvoiceProperties } from '../entities/InvoiceProperties';
import { Invoices } from '../entities/Invoices';
import { ItemTypes } from '../entities/ItemTypes';
import { MigrationsLock } from '../entities/MigrationsLock';
import { Migrations } from '../entities/Migrations';
import { Organization } from '../entities/Organization';
import { PermissionGroups } from '../entities/PermissionGroups';
import { PermissionGroupsMappings } from '../entities/PermissionGroupsMappings';
import { PermissionMappings } from '../entities/PermissionMappings';
import { Permissions } from '../entities/Permissions';
import { Plans } from '../entities/Plans';
import { Role } from '../entities/Role';
import { RoleMapping } from '../entities/RoleMapping';
import { Scope } from '../entities/Scope';
import { ServiceInstances } from '../entities/ServiceInstances';
import { ServiceItems } from '../entities/ServiceItems';
import { ServiceProperties } from '../entities/ServiceProperties';
import { ServiceTypes } from '../entities/ServiceTypes';
import { Sessions } from '../entities/Sessions';
import { Setting } from '../entities/Setting';
import { SystemSettings } from '../entities/SystemSettings';
import { Tasks } from '../entities/Tasks';
import { Tickets } from '../entities/Tickets';
import { Transactions } from '../entities/Transactions';
import { User } from '../entities/User';

export const dbEntities = [
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