/*
This module is responsible for proper loading of main database of application
Importing this module in the app.module.ts is sufficient for loading the databse. 

*/

import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dbEntities } from './entityImporter/orm-entities';
import { TestDataService } from './test-data.service';
import configurations from '../config/configurations';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({load: [configurations]}),
      ], // Import ConfigModule to use the ConfigService
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        "type": configService.get<string>('database.type'),
        "host": configService.get<string>('database.host'),
        "port": configService.get<number>('database.port'),
        "username": configService.get<string>('database.username'),
        "password": configService.get<string>('database.password'),
        "database": configService.get<string>('database.database'),
        entities: dbEntities,
        
        extra: {
          trustServerCertificate: true,
        },
      } as TypeOrmModuleOptions ),
    }),
    TypeOrmModule.forFeature(dbEntities)
  ],
  providers: [TestDataService],
  exports: [TypeOrmModule]
  
})
export class DatabaseModule {}
