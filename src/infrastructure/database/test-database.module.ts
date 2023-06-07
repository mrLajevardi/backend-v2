/*
This module is responsible for proper loading of test database 
Importing this module in the test files is sufficient for loading the database for test purposes. 

*/

import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { dbTestEntities } from './entityImporter/orm-test-entities';
import { TestDataService } from './test-data.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      autoLoadEntities: true,
      entities: dbTestEntities,
      synchronize: true,
    } as TypeOrmModuleOptions),
    TypeOrmModule.forFeature(dbTestEntities),
  ],
  providers: [TestDataService],
  exports: [TypeOrmModule],
})
export class TestDatabaseModule {}
