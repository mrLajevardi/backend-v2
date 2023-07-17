/*
This module is responsible for proper loading of main database of application
Importing this module in the app.module.ts is sufficient for loading the databse. 

*/

import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dbEntities } from './entityImporter/orm-entities';
import { TestDataService } from './test-data.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()], // Import ConfigModule to use the ConfigService
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: process.env.DB_TYPE,
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: dbEntities,
          uuidExtension: true,
          extra: {
            trustServerCertificate: true,
          },
        } as TypeOrmModuleOptions),
    }),
    TypeOrmModule.forFeature(dbEntities),
  ],
  providers: [TestDataService],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
