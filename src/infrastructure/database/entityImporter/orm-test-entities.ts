/*
This is for laodiing all of entities in an array at once
this helps us preventing cluttered app module. 
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
import { Scope } from '../test-entities/Scope';
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
import { DebugLog } from '../test-entities/DebugLog';
import { InfoLog } from '../test-entities/InfoLog';
import { ErrorLog } from '../test-entities/ErrorLog';
import { Sysdiagrams } from '../test-entities/Sysdiagrams';
import { QualityPlans } from '../test-entities/views/quality-plans';
import { ServiceItemsSum } from '../test-entities/views/service-items-sum';
import { ServicePlans } from '../test-entities/ServicePlans';
import { InvoiceItemList } from '../test-entities/views/invoice-item-list';

export const dbTestEntities = [
  //Views
  QualityPlans,
  ServiceItemsSum,
  InvoiceItemList,
  // Logs Schema
  DebugLog,
  InfoLog,
  ErrorLog,
  // Security Schema
  AccessToken,
  Acl,
  Migrations,
  MigrationsLock,
  PermissionGroups,
  PermissionGroupsMappings,
  PermissionMappings,
  Permissions,
  Role,
  RoleMapping,
  Scope,
  Setting,
  SystemSettings,
  User,
  // services Schema
  Configs,
  Discounts,
  ItemTypes,
  Plans,
  ServiceTypes,
  // VDC Schema
  Organization,
  Sessions,
  Sysdiagrams,
  // User Schema
  AiTransactionsLogs,
  Groups,
  GroupsMapping,
  InvoiceDiscounts,
  InvoiceItems,
  InvoicePlans,
  InvoiceProperties,
  Invoices,
  ServiceInstances,
  ServiceItems,
  ServiceProperties,
  Tasks,
  Tickets,
  Transactions,
  ServicePlans,
];
