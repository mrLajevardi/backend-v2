/*
This module is responsible for proper loading of main database of application
Importing this module in the app.module.ts is sufficient for loading the databse. 

*/

import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dbEntities } from './entityImporter/orm-entities';
import { TestDataService } from './test-data.service';
import { dbTestEntities } from './entityImporter/orm-test-entities';
const isTestMode = process.env.NODE_ENV === 'test';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()], // Import ConfigModule to use the ConfigService
      useFactory: () =>
        (!isTestMode
          ? {
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
            } as TypeOrmModuleOptions
          : {
              type: 'sqlite',
              database: ':memory:',
              autoLoadEntities: true,
              entities: dbTestEntities,
              synchronize: true,
            } as TypeOrmModuleOptions
        )
    }),
    TypeOrmModule.forFeature(dbEntities),
  ],
  providers: [TestDataService],
  exports: [TypeOrmModule],
})
export class DatabaseModule implements OnModuleInit {
  onModuleInit() {
    if (isTestMode) {
      console.log('Running in unit test mode');
      // Perform additional actions for test mode if needed
    } else {
      console.log('Running in real run mode');
      // Perform additional actions for real run mode if needed
    }
  }
}
