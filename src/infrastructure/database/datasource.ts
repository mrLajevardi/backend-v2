import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Environment } from '../enum/evironment.enum';
import { join } from 'path';

dotenvConfig({ path: '.env' });
let migrationPath: string;

switch (`${process.env.Environment}`) {
  case Environment.Development:
    migrationPath = join(
      'dist/infrastructure/database/migrations/',
      'development',
    );
    break;
  case Environment.Release:
    migrationPath = join('dist/infrastructure/database/migrations/', 'release');
    break;
  case Environment.Production:
    migrationPath = join(
      'dist/infrastructure/database/migrations/',
      'production',
    );
    break;
  default:
    migrationPath = join(
      'dist/infrastructure/database/migrations/',
      'development',
    );
    break;
}

const config: DataSourceOptions = {
  type: `${process.env.DB_TYPE}` as 'mssql',
  host: `${process.env.DB_HOST}`,
  port: Number(`${process.env.DB_PORT}`),
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  entities: [
    'src/infrastructure/database/entities/AccessToken{.ts,.js}',
    'src/infrastructure/database/entities/Acl{.ts,.js}',
    'src/infrastructure/database/entities/AiTransactionsLogs{.ts,.js}',
    'src/infrastructure/database/entities/City{.ts,.js}',
    'src/infrastructure/database/entities/Company{.ts,.js}',
    'src/infrastructure/database/entities/Configs{.ts,.js}',
    'src/infrastructure/database/entities/Datacenter{.ts,.js}',
    'src/infrastructure/database/entities/DebugLog{.ts,.js}',
    'src/infrastructure/database/entities/Discounts{.ts,.js}',
    'src/infrastructure/database/entities/EntityLog{.ts,.js}',
    'src/infrastructure/database/entities/ErrorLog{.ts,.js}',
    'src/infrastructure/database/entities/Files{.ts,.js}',
    'src/infrastructure/database/entities/Groups{.ts,.js}',
    'src/infrastructure/database/entities/GroupsMapping{.ts,.js}',
    'src/infrastructure/database/entities/InfoLog{.ts,.js}',
    'src/infrastructure/database/entities/InvoiceDiscounts{.ts,.js}',
    'src/infrastructure/database/entities/InvoiceItems{.ts,.js}',
    'src/infrastructure/database/entities/InvoicePlans{.ts,.js}',
    'src/infrastructure/database/entities/InvoiceProperties{.ts,.js}',
    'src/infrastructure/database/entities/Invoices{.ts,.js}',
    'src/infrastructure/database/entities/ItemTypes{.ts,.js}',
    'src/infrastructure/database/entities/Migrations{.ts,.js}',
    'src/infrastructure/database/entities/MigrationsLock{.ts,.js}',
    'src/infrastructure/database/entities/Notifications{.ts,.js}',
    'src/infrastructure/database/entities/Organization{.ts,.js}',
    'src/infrastructure/database/entities/PermissionGroups{.ts,.js}',
    'src/infrastructure/database/entities/PermissionGroupsMappings{.ts,.js}',
    'src/infrastructure/database/entities/PermissionMappings{.ts,.js}',
    'src/infrastructure/database/entities/Permissions{.ts,.js}',
    'src/infrastructure/database/entities/Plans{.ts,.js}',
    'src/infrastructure/database/entities/Province{.ts,.js}',
    'src/infrastructure/database/entities/Role{.ts,.js}',
    'src/infrastructure/database/entities/RoleMapping{.ts,.js}',
    'src/infrastructure/database/entities/Scope{.ts,.js}',
    'src/infrastructure/database/entities/ServiceDiscount{.ts,.js}',
    'src/infrastructure/database/entities/ServiceInstances{.ts,.js}',
    // 'src/infrastructure/database/entities/ServiceItems{.ts,.js}',
    'src/infrastructure/database/entities/ServicePayments{.ts,.js}',
    'src/infrastructure/database/entities/ServicePlans{.ts,.js}',
    'src/infrastructure/database/entities/ServiceProperties{.ts,.js}',
    'src/infrastructure/database/entities/ServiceTypes{.ts,.js}',
    'src/infrastructure/database/entities/Sessions{.ts,.js}',
    'src/infrastructure/database/entities/Setting{.ts,.js}',
    'src/infrastructure/database/entities/Sysdiagrams{.ts,.js}',
    'src/infrastructure/database/entities/SystemSettings{.ts,.js}',
    'src/infrastructure/database/entities/Tasks{.ts,.js}',
    'src/infrastructure/database/entities/Templates{.ts,.js}',
    'src/infrastructure/database/entities/Tickets{.ts,.js}',
    'src/infrastructure/database/entities/Transactions{.ts,.js}',
    'src/infrastructure/database/entities/User{.ts,.js}',
    // 'src/infrastructure/database/entities/views/*{.ts,.js}',
  ],
  migrations: [
    join(migrationPath, 'schema', '*{.ts,.js}'),
    join(migrationPath, 'data', '*{.ts,.js}'),
  ],
  synchronize: false,
  pool: {
    max: 2,
    // maxWaitingClients: 30,
  },
  extra: {
    trustServerCertificate: true,
    max: 2,
    connectionLimit: 2,
  },
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
