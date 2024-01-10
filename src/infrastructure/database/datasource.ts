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
    // 'src/infrastructure/database/entities/*{.ts,.js}',
    'src/infrastructure/database/entities/views/*{.ts,.js}',
  ],
  migrations: [
    join(migrationPath, 'schema', '*{.ts,.js}'),
    join(migrationPath, 'data', '*{.ts,.js}'),
  ],
  synchronize: false,
  extra: {
    trustServerCertificate: true,
  },
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
