import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dbEntities } from './entityImporter/orm-entities';
import { TestDatabaseModule } from './test-database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'src/infrastructure/database.json', 
    }),
    ConfigModule.forRoot(), // Import the ConfigModule from `@nestjs/config`
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to use the ConfigService
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('DB_TYPE', 'mssql'),
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 1433),
        username: configService.get<string>('DB_USERNAME', 'dev'),
        password: configService.get<string>('DB_PASSWORD', 'password'),
        database: configService.get<string>('DB_NAME', 'mydatabase'),
        autoLoadEntities: true,
        entities: dbEntities,
        synchronize: false,
        extra: {
          trustServerCertificate: true,
        },
      } as TypeOrmModuleOptions ),
      inject: [ConfigService],
    }), TestDatabaseModule,
  ],
})
export class DatabaseModule {}
