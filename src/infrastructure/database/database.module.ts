/*
This module is responsible for proper loading of main database of application
Importing this module in the app.module.ts is sufficient for loading the databse. 

*/

import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { dbEntities } from './entityImporter/orm-entities';
import { TestDataService } from './test-data.service';
import { ConfigModule } from '@nestjs/config';
import { isTestingEnv } from '../helpers/helpers';
import { CacheModule } from '@nestjs/cache-manager';
import { EntitySubscriber } from './classes/entity.subscriber';
import { EntityManager } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        console.log('🥨🥨🥨');
        return !isTestingEnv()
          ? ({
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
              // subscribers: [EntitySubscriber],
            } as TypeOrmModuleOptions)
          : ({
              type: 'sqlite',
              database: ':memory:',
              autoLoadEntities: true,
              entities: dbEntities,
              synchronize: true,
            } as TypeOrmModuleOptions);
      },
    }),
    TypeOrmModule.forFeature(dbEntities),
  ],
  providers: [TestDataService],
  exports: [
    TypeOrmModule,
    ConfigModule.forRoot({
      isGlobal: true,
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
