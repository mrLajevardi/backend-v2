/*
This module is responsible for proper loading of main database of application
Importing this module in the app.module.ts is sufficient for loading the databse. 

*/

import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { dbEntities } from './entityImporter/orm-entities';
import { TestDataService } from './test-data.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { isTestingEnv } from '../helpers/helpers';
import { CacheModule } from '@nestjs/cache-manager';
import { EntitySubscriber } from './classes/entity.subscriber';
import { EntityManager } from 'typeorm';
import datasource from './datasource';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [datasource],
    }),
    CacheModule.register({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const config = configService.get('typeorm');
        const datasource: TypeOrmModuleOptions = {
          ...config,
          entities: [dbEntities],
        };
        return datasource;
      },
    }),
    TypeOrmModule.forFeature(dbEntities),
  ],
  providers: [TestDataService],
  exports: [
    TypeOrmModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [datasource],
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  onModuleInit() {
    if (isTestingEnv()) {
      console.log('Running in unit test mode');
      // Perform additional actions for test mode if needed
    } else {
      console.log('Running in real run mode');
      // Perform additional actions for real run mode if needed
    }
  }
}
