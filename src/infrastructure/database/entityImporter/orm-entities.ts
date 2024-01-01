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
import { DebugLog } from '../entities/DebugLog';
import { InfoLog } from '../entities/InfoLog';
import { ErrorLog } from '../entities/ErrorLog';
import { Sysdiagrams } from '../entities/Sysdiagrams';
import { QualityPlans } from '../entities/views/quality-plans';
import { ServiceItemsSum } from '../entities/views/service-items-sum';
import { InvoiceItemList } from '../entities/views/invoice-item-list';
import { ServicePlans } from '../entities/ServicePlans';
import { ServiceReports } from '../entities/views/service-reports';
import { ServiceItemTypesTree } from '../entities/views/service-item-types-tree';
import { Templates } from '../entities/Templates';
import { Company } from '../entities/Company';
import { Province } from '../entities/Province';
import { City } from '../entities/City';
import { FileUpload } from '../entities/FileUpload';
import { EntityLog } from '../entities/EntityLog';
import { ServicePayments } from '../entities/ServicePayments';
import { VServiceInstances } from '../entities/views/v-serviceInstances';
import { VServiceInstanceDetail } from '../entities/views/v-serviceInstanceDetail';
import { ServiceDiscount } from '../entities/ServiceDiscount';
import { VUsers } from '../entities/views/v-users';
// import { ItemTypesConfig } from '../entities/ItemTypesConfig';

export const dbEntities = [
  //Views
  QualityPlans,
  ServiceItemsSum,
  InvoiceItemList,
  ServiceItemTypesTree,
  VUsers,
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
  Company,
  Province,
  City,
  Configs,
  Discounts,
  ItemTypes,
  Plans,
  ServiceTypes,
  Templates,
  Organization,
  Sessions,
  Sysdiagrams,
  // User Schema
  AiTransactionsLogs,
  ServicePlans,
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
  ServiceReports,
  ServiceItems,
  FileUpload,
  EntityLog,
  ServicePayments,
  VServiceInstances,
  VServiceInstanceDetail,
  ServiceDiscount,
];
