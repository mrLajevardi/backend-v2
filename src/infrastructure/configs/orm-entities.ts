import { GroupsMapping } from '../db/entities/GroupsMapping';
import { AccessToken } from '../db/entities/AccessToken';
import { Acl } from '../db/entities/Acl';
import { AiTransactionsLogs } from '../db/entities/AiTransactionsLogs';
import { Configs } from '../db/entities/Configs';
import { Discounts } from '../db/entities/Discounts';
import { Groups } from '../db/entities/Groups';
import { InvoiceDiscounts } from '../db/entities/InvoiceDiscounts';
import { InvoiceItems } from '../db/entities/InvoiceItems';
import { InvoicePlans } from '../db/entities/InvoicePlans';
import { InvoiceProperties } from '../db/entities/InvoiceProperties';
import { Invoices } from '../db/entities/Invoices';
import { ItemTypes } from '../db/entities/ItemTypes';
import { MigrationsLock } from '../db/entities/MigrationsLock';
import { Migrations } from '../db/entities/Migrations';
import { Organization } from '../db/entities/Organization';
import { PermissionGroups } from '../db/entities/PermissionGroups';
import { PermissionGroupsMappings } from '../db/entities/PermissionGroupsMappings';
import { PermissionMappings } from '../db/entities/PermissionMappings';
import { Permissions } from '../db/entities/Permissions';
import { Plans } from '../db/entities/Plans';
import { Role } from '../db/entities/Role';
import { RoleMapping } from '../db/entities/RoleMapping';
import { Scope } from '@nestjs/common';
import { ServiceInstances } from '../db/entities/ServiceInstances';
import { ServiceItems } from '../db/entities/ServiceItems';
import { ServiceProperties } from '../db/entities/ServiceProperties';
import { ServiceTypes } from '../db/entities/ServiceTypes';
import { Sessions } from '../db/entities/Sessions';
import { Setting } from '../db/entities/Setting';
import { SystemSettings } from '../db/entities/SystemSettings';
import { Tasks } from '../db/entities/Tasks';
import { Tickets } from '../db/entities/Tickets';
import { Transactions } from '../db/entities/Transactions';
import { User } from '../db/entities/User';

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